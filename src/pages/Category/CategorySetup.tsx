import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Button,
  Drawer,
  message,
  Popconfirm,
  Form,
  Input,
  Upload,
  Modal,
} from "antd";
import type { TableProps } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;

import CreateCategory from "./CreateCategory";

import {
  useFetchCategory,
  useDeleteCategory,
  useFindCategoryById,
  useDownloadCategoryDetails,
  useUploadCategoryDetails,
} from "../../api/category/queries";

interface CategoryDataType {
  id: string;
  name: string;
  discription: string;
}

const CategorySetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryDataType | any
  >(null);
  const [findTheCategory, setFindTheCategory] = useState<
    CategoryDataType | any
  >(null);
  const [findByName, setFindByName] = useState<CategoryDataType | any>(null);
  const [inputValueIsNumber, setInputValueIsNumber] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();
  const [uploadForm] = Form.useForm();

  const [searchedCategoryId, setSearchedCategoryId] = useState<
    CategoryDataType | any
  >("");
  const [page, setPage] = React.useState(1);

  const columns: TableProps<CategoryDataType>["columns"] = [
    {
      title: "SN",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (page - 1) * 7 + index + 1,
      sorter: (a, b) => {
        const numA = parseInt(a.id, 10);
        const numB = parseInt(b.id, 10);
        return numA - numB;
      },
      sortDirections: ["descend"],
      defaultSortOrder: "ascend",
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "discription",
      key: "discription",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditDrawer(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            okButtonProps={{ danger: true }}
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showEditDrawer = (category: CategoryDataType) => {
    form.setFieldsValue(category);
    setSelectedCategory(category);
    setOpen(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchCategory();
    setSelectedCategory(null);
    setSearchedCategoryId(searchedCategoryId);
  };

  const { mutate: deleteThisCategory } = useDeleteCategory();

  const handleDelete = (categoryID: any) => {
    deleteThisCategory(categoryID, {
      onSuccess: (data) => {
        message.success(`Deleted category Successfully ${data}`);
        setFindTheCategory(null);
        refetchCategory();
      },
    });
  };

  const handleDownloadCategoryDetails = () => {
    downloadCategorys(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "category_details.xlsx";
        link.click();
      },
      onError: (data) => {
        message.error(`Failed to Download: ${data}`);
      },
    });
  };

  const {
    data: categoryData,
    isLoading: isLoadingCategoryData,
    refetch: refetchCategory,
  } = useFetchCategory();

  const { mutate: downloadCategorys } = useDownloadCategoryDetails();

  const { data: findCategory, refetch: refetchFindCategory } =
    useFindCategoryById(searchedCategoryId);

  const searchById = (values: any) => {
    setSearchedCategoryId(values.categoryId.trim());
  };

  const handleNameChange = (event: any) => {
    if (event.target.value === "") {
      setFindTheCategory(null);
      setSearchedCategoryId("");
      setInputValueIsNumber(false);
    } else if (!isNaN(event.target.value)) {
      setInputValueIsNumber(true);
    }
    setSearchText(event.target.value.trim());
  };

  useEffect(() => {
    const searchedCategorys = categoryData?.filter(
      (category: CategoryDataType) => {
        return Object.values(category).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        );
      }
    );
    setFindByName(searchedCategorys);
  }, [searchText, categoryData]);

  useEffect(() => {
    if (searchedCategoryId) {
      setFindTheCategory(findCategory);
    }
  }, [searchedCategoryId, refetchFindCategory, findCategory]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [fileList, setFileList] = useState<any[]>([]);
  const { mutate: uploadCategory } = useUploadCategoryDetails();

  const props: UploadProps = {
    name: "file",
    fileList: fileList,
    action: "",
    beforeUpload: (file: File) => {
      const isExcel =
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        message.error("You can only upload Excel files!");
        return false;
      }
      setFileList([file]);
      onFinish(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const onFinish = (e: any) => {
    let payload = {
      file: e.file.file,
    };

    uploadCategory(payload, {
      onSuccess: () => {
        message.success("Sucessfully uploaded");
        setIsModalOpen(false);
        refetchCategory();
      },
      onError: (data) => {
        message.error(`Failed ${data}`);
      },
    });
  };

  return (
    <div className="flex-grow mx-10 mt-5 max-h-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Category Setup</h2>
        <Button
          className="bg-white text-black font-bold py-1 px-4 rounded-full transform hover:scale-105 hover:shadow-md"
          type="default"
          onClick={showDrawer}
        >
          Create
        </Button>
        <Drawer
          className="flex"
          width={800}
          autoFocus
          title={selectedCategory ? "Edit Category" : "Create Category"}
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <CreateCategory
              selectedCategory={selectedCategory}
              form={form}
              onSucess={onClose}
            />
          </div>
        </Drawer>
      </div>
      <div className=" flex flex-wrap items-center">
        <Form
          form={inputForm}
          onFinish={searchById}
          className="flex items-center mb-0"
        >
          <Form.Item name="categoryId" className="mr-2 w-50">
            <Input
              placeholder="Search"
              value={
                searchedCategoryId
                  ? searchedCategoryId
                  : searchText
                  ? searchText
                  : ""
              }
              onChange={handleNameChange}
              className="border-2 border-blue-500 focus:border-blue-700 rounded-md  outline-none font-extrabold"
            />
          </Form.Item>

          {inputValueIsNumber && (
            <Form.Item className="">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2  rounded-lg"
                type="default"
                htmlType="submit"
              >
                Search By Id ??
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
      <Table
        columns={columns}
        dataSource={
          findTheCategory
            ? [findTheCategory]
            : findByName
            ? findByName
            : categoryData
        }
        loading={isLoadingCategoryData}
        rowKey="id"
        pagination={{
          pageSize: 7,
          responsive: true,
          onChange(current) {
            setPage(current);
          },
        }}
      />

      <Button
        className=" mb-4  bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        type="default"
        onClick={handleDownloadCategoryDetails}
        icon={<DownloadOutlined />}
      >
        Download Category Details
      </Button>

      <Button
        className="ml-4 bg-blue-500  text-white font-bold px-2 rounded"
        icon={<UploadOutlined />}
        onClick={showModal}
      >
        Upload Category Data in Excel
      </Button>

      <Modal
        footer
        title="Upload Category Data"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={uploadForm}
          onFinish={onFinish}
          className="flex flex-col justify-between h-full"
        >
          <Form.Item name="file" className="mb-4">
            <Dragger name="file" {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Please note: Ensure that you only upload Excel files, and ensure
                that your Excel file's columns are properly formatted. Thank
                you.
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2  rounded-lg mt-2 mb-0  absolute left-52"
              type="default"
              htmlType="submit"
            >
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategorySetup;
