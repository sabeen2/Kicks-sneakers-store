import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { usePotentialCustomers } from "../../api/potential/queries";
import { useGetAllProducts } from "../../api/product/queries";

interface CustomerData {
  id?: number;
  customerEmail: string;
  phone: string;
  name: string;
  productId: number;
}

interface SelectedCustomer {
  id?: number;
  customerEmail: string;
  phone: string;
  name: string;
  productId: number;
}

const CustomerTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CustomerData | null>(null);
  editingRecord;
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

  const { data: allProductsData } = useGetAllProducts();
  const { data: potentialCustomers, refetch } = usePotentialCustomers();
  const [form] = Form.useForm(); // Create form instance

  const columns = [
    {
      title: "Customer Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Product Name",
      dataIndex: "productId",
      key: "productId",
      render: (productId: number) => {
        const product = allProductsData?.find(
          (p: any) => p.prodId === productId
        );
        return product ? product.prodName : "Loading...";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: CustomerData) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (record: CustomerData) => {
    setSelectedCustomer(record);
    console.log("Editing customer:", record);
    setEditingRecord(record);
    form.setFieldsValue(record); // Set form values with the selected record
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    setSelectedCustomer(null);
    form.resetFields(); // Reset form fields
  };

  const handleSave = async (values: CustomerData) => {
    const token = localStorage.getItem("bookRental");
    const url = "https://orderayo.onrender.com/potential-customers";
    const headers = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const payload = selectedCustomer
      ? { ...values, id: selectedCustomer.id }
      : values;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response data:", data);

      message.success(
        selectedCustomer
          ? "Customer updated successfully"
          : "Customer added successfully"
      );
      refetch(); // Refresh the table data
      setIsModalVisible(false);
      setEditingRecord(null);
      setSelectedCustomer(null);
      form.resetFields();
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again.");
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingRecord(null);
    setSelectedCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  console.log({});

  return (
    <div className="p-4">
      <button
        className="absolute right-20 bg-white px-4 py-1 rounded-lg font-semibold border-[1px] border-gray-800"
        onClick={handleAdd}
      >
        Add
      </button>
      <Table
        className="mt-12"
        dataSource={potentialCustomers}
        columns={columns}
        rowKey="customerEmail"
      />

      <Modal
        title={selectedCustomer ? "Edit Customer" : "Add Customer"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          // initialValues={editingRecord || {}}
          onFinish={handleSave}
        >
          <Form.Item
            name="customerEmail"
            label="Customer Email"
            rules={[
              { required: true, message: "Please input the customer email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="customerName"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: "Please select the product!" }]}
          >
            <Select>
              {allProductsData?.map((product: any) => (
                <Select.Option key={product.prodId} value={product.prodId}>
                  {product.prodName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              className="bg-blue-600 text-white"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerTable;
