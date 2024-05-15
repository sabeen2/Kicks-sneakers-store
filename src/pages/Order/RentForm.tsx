import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Space,
  message,
  Select,
  InputNumber,
} from "antd";

import { useAddTransaction } from "../../api/order/queries";
import axios from "axios";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface TransactionDataType {
  orderId: any;
  quantity: any;
  productId: any;
  customerContact: any;
  customerName: any;
  id: number;
  bookName: string;
  bookId: number;
  fromDate: any;
  toDate: any;
  rentType: string;
  memberName: string;
  Fk_member_id: number;
}

interface CreateTransactionProps {
  setSelectedTransaction?: TransactionDataType | null | undefined;
  selectedTransaction?: TransactionDataType | null | undefined;
  form: FormInstance<any>;
  onSucess: () => void;
}

const CreateTransaction: React.FC<CreateTransactionProps> = ({
  selectedTransaction,
  form,
  onSucess,
}) => {
  const { mutate: addTransaction, isLoading: isAddingTransaction } =
    useAddTransaction();

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleProductSelect = (selectedProductIds: any) => {
    setSelectedProducts(selectedProductIds);
  };

  const renderQuantityInputs = () => {
    return selectedProducts.map((productId) => (
      <Form.Item
        key={productId}
        label={`Quantity for Product ${productId}`}
        name={["orderItems", productId, "quantity"]}
        rules={[{ required: true, message: "Please enter quantity" }]}
      >
        <InputNumber className="w-full" />
      </Form.Item>
    ));
  };

  const onFinish = (values: any) => {
    let payload = {
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      address: values.address,
      customerContact: values.customerContact,
      orderItems: selectedProducts.map((productId) => ({
        productId,
        quantity: values.orderItems[productId]?.quantity, // Get quantity for each product
      })),
    };

    if (selectedTransaction) {
      console.log(selectedTransaction);
      payload = {
        ...payload,
        orderId: (selectedTransaction as { orderId: any }).orderId,
      };
    }

    selectedTransaction
      ? addTransaction(payload, {
          onSuccess: (data: any) => {
            message.success(`Edited transaction Sucessfully:  ${data}`);
            onSucess();
          },
        })
      : addTransaction(payload, {
          onSuccess: (data) => {
            message.success(`Added transaction Sucessfully:  ${data}`);
            onSucess();
          },
          onError: (errorMessage: any) => {
            message.error(`Failed : ${errorMessage}`);
          },
        });
  };

  useEffect(() => {
    if (selectedTransaction) {
      form.setFieldsValue(selectedTransaction);
    }
  }, [selectedTransaction, form]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("bookRental");
        const response = await axios.post(
          "https://orderayo.onrender.com/products/all-products-without-pagination",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );
        setProducts(response.data.data);
      } catch (error) {}
    };

    fetchProducts();
  }, []);

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
          label="Customer Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please enter customer address",
            },
          ]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          label="Customer Email"
          name="customerEmail"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter valid customer Email",
            },
          ]}
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
            options={products?.map((product: any) => ({
              value: product.prodId,
              label: product.prodName,
            }))}
            onChange={handleProductSelect}
          />
        </Form.Item>
        {renderQuantityInputs()}
        <Form.Item {...tailLayout}>
          <Space>
            <Button
              loading={isAddingTransaction}
              className="bg-blue-400 text-white font-bold px-4 rounded-full"
              type="default"
              htmlType="submit"
            >
              Submit
            </Button>
            <Button
              className="border border-gray-900 py-1 px-5 rounded-full"
              htmlType="button"
              onClick={() => form.resetFields()}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTransaction;
