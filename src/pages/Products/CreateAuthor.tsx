import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Space,
  message,
  Upload,
  Select,
} from "antd";
import axios from "axios";
import { BASE_API_ENDPOINT } from "../../config/api.config";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface AuthorDataType {
  authorId: any;
  name: string;
  stock: number;
  prodType: string;
  sellingPrice: number;
  costPrice: number;
  file: File | undefined;
}

interface CreateAuthorProps {
  setSelectedAuthor?: AuthorDataType | null | undefined | any;
  selectedAuthor?: AuthorDataType | null | undefined | any;
  form: FormInstance<any>;
  onSucess: () => void;
}

const CreateAuthor: React.FC<CreateAuthorProps> = ({
  selectedAuthor,
  form,
  onSucess,
}) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const token = localStorage.getItem("bookRental");

  const onFinish = async (values: any) => {
    setIsAddingProduct(true);
    let payload: any = {
      name: values.name,
      stock: values.stock,
      prodType: values.prodType,
      sellingPrice: values.sellingPrice,
      costPrice: values.costPrice,
      file: values.file?.[0]?.originFileObj,
    };

    if (selectedAuthor) {
      payload.prodId = selectedAuthor?.prodid;
    }

    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    selectedAuthor;
    try {
      const response = await axios.post(
        `${BASE_API_ENDPOINT}/products/add-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      response;

      message.success(
        selectedAuthor
          ? `Edited product successfully: ${values.name}`
          : `Added product successfully: ${values.name}`
      );
      onSucess();
    } catch (error) {
      message.error(`Failed to add product: ${message}`);
    }

    setIsAddingProduct(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (selectedAuthor) {
      form.setFieldsValue({
        prodId: selectedAuthor?.prodid,
        name: selectedAuthor?.prodname?.value,
        stock: selectedAuthor?.availablestock,
        costPrice: selectedAuthor?.costprice,
        prodType: selectedAuthor?.prodtype,
        sellingPrice: selectedAuthor?.sellingprice,
      });
    }
  }, [selectedAuthor, form]);

  return (
    <div className="bg-white p-6 rounded">
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        {/* Form fields */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter the name",
            },
          ]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            {
              required: true,
              message: "Please enter the stock",
            },
          ]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Product Type"
          name="prodType"
          rules={[
            {
              required: true,
              message: "Please enter the product type",
            },
          ]}
        >
          <Select
            className="w-full py-2 px-4 border border-gray-900 rounded"
            options={[
              { value: "UNISEX", label: <span>UNISEX</span> },
              { value: "MEN", label: <span>MEN</span> },
              { value: "WOMEN", label: <span>WOMEN</span> },
              { value: "KIDS", label: <span>KIDS</span> },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Selling Price"
          name="sellingPrice"
          rules={[
            {
              required: true,
              message: "Please enter the selling price",
            },
          ]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Cost Price"
          name="costPrice"
          rules={[
            {
              required: true,
              message: "Please enter the cost price",
            },
          ]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="File"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          rules={[
            {
              required: false,
              message: "Please upload a file",
            },
          ]}
        >
          <Upload.Dragger
            name="file"
            action="https://orderayo.onrender.com/products/upload-file"
            headers={{
              Authorization: `Bearer ${token}`,
            }}
            multiple={false}
            beforeUpload={() => false} // Prevent default upload behavior
          >
            <p className="ant-upload-drag-icon">
              Drag & drop or click to select file
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              className="bg-blue-400 text-white font-bold px-4 rounded-full"
              type="default"
              htmlType="submit"
              loading={isAddingProduct}
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

export default CreateAuthor;
