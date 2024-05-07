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

import {
  useAddTransaction,
  useupdateTransaction,
} from "../../api/order/queries";
import { useFetchMember } from "../../api/members/queries";

import dayjs from "dayjs";
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
  // const { mutate: editTransaction } = useupdateTransaction();
  const [products, setProducts] = useState([]);

  const onFinish = (values: any) => {
    console.log(values);
    let payload: any = {
      customerName: values.customerName,
      customerContact: values.customerContact,
      orderItems: [
        {
          productId: values.productId,
          quantity: values.quantity,
        },
      ],
    };
    if (selectedTransaction) {
      payload = {
        ...payload,
        orderId: selectedTransaction.orderId,
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

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (selectedTransaction) {
      form.setFieldsValue({
        customerName: selectedTransaction.customerName,
        customerContact: selectedTransaction.customerContact,
        orderItems: [
          {
            productId: selectedTransaction.productId,
            quantity: selectedTransaction.quantity,
          },
        ],
      });
    }
  }, [selectedTransaction, form]);

  const { data: memberData } = useFetchMember();

  const calculateToDate = (value: any) => {
    if (value === null) {
      form.setFieldsValue({ toDate: null });
    }
    const fromDate = new Date();
    form.setFieldsValue({ fromDate: fromDate.toISOString().split("T")[0] });
    if (fromDate && value) {
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + value);
      form.setFieldsValue({ toDate: toDate.toISOString().split("T")[0] });
    }
  };

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
            className="w-full"
            placeholder="Select Product"
            options={products.map((product: any) => ({
              value: product.prodid,
              label: product.prodname.value,
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

export default CreateTransaction;
