import { useState, useEffect } from "react";
import { Button, Form, Input, Space, message, Select, InputNumber } from "antd";
import axios from "axios";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CreateOrder = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("bookRental");
        const response = await axios.post(
          "https://orderayo.onrender.com/products/get-all-products",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );
        console.log("Fetched products:", response.data.data.content);
        setProducts(response.data.data.content);
      } catch (error) {}
    };

    fetchProducts();
  }, []);

  console.log("Productsss:", products);

  const token = localStorage.getItem("bookRental");

  const onFinish = (values: any) => {
    console.log(`ELO: ${values}`);
    const payload = {
      customerName: values.customerName,
      customerContact: values.customerContact,
      orderItems: [
        {
          productId: [values.productId],
          quantity: [values.quantity],
        },
      ],
    };

    axios
      .post("https://orderayo.onrender.com/orders/add-order", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          message.success("Product added");
          form.resetFields();
        } else {
          message.error("Failed to add product");
        }
      })
      .catch(() => {
        message.error("Failed to add product");
      });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="bg-white p-6 rounded">
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: "Please enter customer name" }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          label="Customer Contact"
          name="customerContact"
          rules={[{ required: true, message: "Please enter customer contact" }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          label="Product"
          name="productId"
          rules={[{ required: true, message: "Please select a product" }]}
        >
          <Select
            mode="multiple"
            className="w-full"
            placeholder="Select Product"
            options={products.map((product: any) => ({
              value: [product.prodid],
              label: [product.prodname.value],
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button
              className="bg-blue-400 text-white font-bold px-4 rounded-full"
              type="default"
              htmlType="submit"
            >
              Submit
            </Button>
            <Button
              className="border border-gray-900 py-1 px-5 rounded-full"
              htmlType="button"
              onClick={onReset}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateOrder;
