import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  message,
  Slider,
} from "antd";

import { UploadOutlined, StarOutlined } from "@ant-design/icons";
import { useAddBook } from "../../api/book/queries";
import { useFetchAuthor } from "../../api/author/queries";
import { useFetchCategory } from "../../api/category/queries";
import dayjs from "dayjs";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface BookDataType {
  id: string;
  name: string;
  rating: any;
  stock: any;
  publishedDate: any;
  file: any;
  isbn: any;
  pages: any;
  categoryId: any;
  authorId: any;
  photo: any;
  authorDetails: any;
  categoryName: string;
}

interface CreateBookProps {
  selectedBook?: BookDataType | null | undefined;
  form: FormInstance<any>;
  onSucess: () => void;
}
 
const CreateBook: React.FC<CreateBookProps> = ({
  selectedBook,
  form,
  onSucess,
}) => {
  const { mutate: addBook, isLoading: isAddingBook } = useAddBook();

  const onFinish = (values: any) => {
    let payload: any = {
      name: values.name.trim(),
      rating: parseFloat(values.rating),
      stock: values.stock,
      publishedDate: dayjs(values.publishedDate).format("YYYY/MM/DD"),
      file: values.file.file,
      isbn: values.isbn.trim(),
      pages: values.pages,
      categoryId: values.categoryId,
      authorId: values.authorId,
    };

    if (selectedBook) {
      payload = {
        ...payload,
        id: selectedBook.id,
      };
    }
    selectedBook
      ? addBook(payload, {
          onSuccess: () => {
            message.success(`Edited book Sucessfully `);
            onSucess();
          },
          onError: (data: any) => {
            message.error(`Failed Editing ${data.errorMessage}`);
          },
        })
      : addBook(payload, {
          onSuccess: (data: any) => {
            message.success(`Added book Sucessfully:  ${data.data}`);
            onSucess();
          },
          onError: (errorMsg: any) => {
            message.error(`Failed Creating: ${errorMsg} `);
          },
        });
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (selectedBook) {
      form.setFieldsValue({
        id: selectedBook.id,
        name: selectedBook.name,
        rating: selectedBook.rating,
        stock: selectedBook.stock,
        publishedDate: dayjs(selectedBook.publishedDate, "YYYY-MM-DD"),
        isbn: selectedBook.isbn,
        pages: selectedBook.pages,
        categoryId: selectedBook.categoryId,
        categoryName: selectedBook.categoryId.categoryName,

        authorId: selectedBook.authorDetails.map(
          (author: any) => author.authorId
        ),

        authorDetails: selectedBook.authorDetails.map(
          (author: any) => author.name
        ),

        photo: selectedBook.photo,
      });
    }
  }, [selectedBook, form]);

  const { data: categoryData } = useFetchCategory();

  const { data: authorData } = useFetchAuthor();

  const beforeImageUpload = (file: File) => {
    const acceptedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const isAccepted = acceptedTypes.includes(file.type);

    if (!isAccepted) {
      message.error(`${file.name} is not a PNG, JPEG, or JPG file`);
    }
    return isAccepted ? false : Upload.LIST_IGNORE;
  };

  return (
    <div className="bg-white p-6 rounded  max-h-96">
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: selectedBook ? false : true,
              message: "Please enter the name",
            },
          ]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="ISBN"
          name="isbn"
          rules={[
            {
              required: selectedBook ? true : true,
              message: "Please enter the valid ISBN",
            },
          ]}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[
            {
              required: selectedBook ? true : true,
              message: "Please select the category",
            },
          ]}
        >
          <Select
            className="w-full"
            placeholder="Select category"
            dropdownStyle={{ border: "1px solid black" }}
            options={categoryData?.map(
              (category: { id: number; name: string }) => ({
                value: category.id,
                label: category.name,
              })
            )}
          />
        </Form.Item>
        <Form.Item
          label="Author"
          name="authorId"
          rules={[
            {
              required: selectedBook ? false : true,
              message: "Please select at least one author",
            },
          ]}
        >
          <Select
            className="w-full"
            mode="multiple"
            placeholder="Select authors"
            options={authorData?.map(
              (author: { authorId: any; name: any }) => ({
                value: author.authorId,
                label: author.name,
              })
            )}
          />
        </Form.Item>

        <Form.Item
          label="Pages"
          name="pages"
          rules={[
            {
              required: selectedBook ? false : false,
              message: "Please enter the valid number of pages",
            },
          ]}
        >
          <InputNumber
            min="1"
            type="number"
            className="w-full  border-gray-900"
          />
        </Form.Item>

        <Form.Item
          label="Rating"
          name="rating"
          rules={[
            {
              required: selectedBook ? false : true,
              message: "Please enter the rating",
            },
          ]}
        >
          <Slider
            min={1}
            max={10}
            step={0.5}
            tooltip={{ open: true, placement: "left" }}
            marks={{
              1: <StarOutlined className="text-yellow-500" />,
              10: <StarOutlined className=" text-xl  text-yellow-500" />,
            }}
            styles={{
              track: { backgroundColor: "#F59E0B" },
              rail: { backgroundColor: "#E5E7EB" },
              handle: { borderColor: "#F59E0B" },
            }}
          />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            {
              required: selectedBook ? false : false,
              type: "number",
              message: "Please enter valid the stock quantity",
            },
          ]}
        >
          <InputNumber
            min="1"
            type="number"
            className=" border-gray-900 w-full"
          />
        </Form.Item>

        <Form.Item
          label="Published Date"
          name="publishedDate"
          rules={[
            {
              required: selectedBook ? false : true,
              message: "Please select the published date",
            },
          ]}
        >
          <DatePicker placeholder="published-date" />
        </Form.Item>

        <Form.Item
          label="Photo Name"
          name="photo"
          rules={[{ required: false, message: "Please enter the photo name" }]}
          style={{ display: "none" }}
        >
          <Input className="w-full py-2 px-4 border border-gray-900 rounded" />
        </Form.Item>

        <Form.Item
          label="Photo"
          name="file"
          rules={[{ required: true, message: "Please upload the photo" }]}
        >
          <Upload
            name="file"
            beforeUpload={beforeImageUpload}
            accept=".jpg,.jpeg,.png"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              className="bg-blue-400  text-white font-bold px-4  rounded-full"
              type="default"
              htmlType="submit"
              loading={isAddingBook}
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

export default CreateBook;
