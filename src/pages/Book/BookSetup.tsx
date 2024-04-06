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
  Rate,
} from "antd";
import type { TableProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

import CreateBook from "./CreateBook";

import {
  useFetchBook,
  useDeleteBook,
  useFindBookById,
} from "../../api/book/queries";
import ImageCard from "./ImageCard";

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
  authorName: any;
  hasImage: boolean;
  authorDetails: any;
}

const BookSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookDataType | any>(null);
  const [findTheBook, setFindTheBook] = useState<BookDataType | any>(null);
  const [findByName, setFindByName] = useState<BookDataType | any>(null);
  const [inputValueIsNumber, setInputValueIsNumber] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();
  const [uploadForm] = Form.useForm();

  const [searchedBookId, setSearchedBookId] = useState<BookDataType | any>("");
  const [page, setPage] = React.useState(1);

  const columns: TableProps<BookDataType>["columns"] = [
    {
      title: "SN",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (page - 1) * 7 + index + 1,
      sorter: (a, b) => {
        const numA = parseInt(a.authorId, 10);
        const numB = parseInt(b.authorId, 10);
        return numA - numB;
      },
      sortDirections: ["descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
      render: (publishedDate) => publishedDate.split("T")[0],
    },
    {
      title: "Author",
      key: "authorName",
      render: (_, record) => {
        const authors = record.authorDetails
          .map((author: any) => author.name)
          .join(", ");
        return <span>{authors}</span>;
      },
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Pages",
      dataIndex: "pages",
      key: "pages",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => {
        if (stock === 0) {
          return <span>Out of Stock</span>;
        } else {
          return <span>{stock} </span>;
        }
      },
    },

    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <Rate
          allowHalf
          disabled
          defaultValue={rating / 2}
          style={{ fontSize: 16 }}
        />
      ),
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <ImageCard
          id={record.id}
          key={record.id}
          hasImage={record?.hasImage == true}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditDrawer(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this book?"
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showEditDrawer = (book: BookDataType) => {
    setSelectedBook(book);
    setOpen(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchBook();
    setSelectedBook(null);
    setSearchedBookId(searchedBookId);
  };

  const { mutate: deleteThisBook } = useDeleteBook();

  const handleDelete = (bookID: any) => {
    deleteThisBook(bookID, {
      onSuccess: (data) => {
        message.success(`Deleted book Successfully ${data}`);
        setFindTheBook(null);
        refetchBook();
      },
    });
  };

  const {
    data: bookData,
    isLoading: isLoadingBookData,
    refetch: refetchBook,
  } = useFetchBook();

  const { data: findBook, refetch: refetchFindBook } =
    useFindBookById(searchedBookId);

  const searchById = (values: any) => {
    setSearchedBookId(values.bookId.trim());
  };

  const handleNameChange = (event: any) => {
    if (event.target.value === "") {
      setFindTheBook(null);
      setSearchedBookId("");
      setInputValueIsNumber(false);
    } else if (!isNaN(event.target.value)) {
      setInputValueIsNumber(true);
    }
    setSearchText(event.target.value.trim());
  };

  useEffect(() => {
    const searchedBooks = bookData?.filter((book: BookDataType) => {
      return Object.values(book).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFindByName(searchedBooks);
  }, [searchText, bookData]);

  useEffect(() => {
    if (searchedBookId) {
      setFindTheBook(findBook);
      refetchFindBook();
    }
  }, [searchedBookId, refetchFindBook, findBook]);

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const beforeExcelUpload = (file: File) => {
    const acceptedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const isAccepted = acceptedTypes.includes(file.type);

    if (!isAccepted) {
      message.error(`${file.name} is not an Excel file`);
    }

    return isAccepted ? false : Upload.LIST_IGNORE;
  };

  return (
    <div className="flex-grow mx-10 mt-5   max-h-96">
      <div className="flex justify-between items-center mb-4	">
        <h2 className="text-xl font-bold">Book Setup</h2>
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
          title={selectedBook ? "Edit Book" : "Create Book"}
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <CreateBook
              selectedBook={selectedBook}
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
          <Form.Item name="bookId" className="mr-2 w-50">
            <Input
              placeholder="Search"
              value={
                searchedBookId ? searchedBookId : searchText ? searchText : ""
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
          findTheBook ? [findTheBook] : findByName ? findByName : bookData
        }
        loading={isLoadingBookData}
        rowKey="bookId"
        pagination={{
          pageSize: 7,
          responsive: true,
          onChange(current) {
            setPage(current);
          },
        }}
      />
      {/* <Button
        className=" mb-4  bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        type="default"
        icon={<DownloadOutlined />}
      >
        Download Book Details
      </Button> */}
      {/* <Button
        className="ml-4 bg-blue-500  text-white font-bold px-2 rounded"
        icon={<UploadOutlined />}
        onClick={showModal}
      >
        Upload Book Data in Excel
      </Button> */}
      <Modal
        footer
        title="Upload Book Data"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={uploadForm}
          className="flex flex-col justify-between h-full"
        >
          <Form.Item name="file" className="mb-4">
            <Dragger
              beforeUpload={beforeExcelUpload}
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              name="file"
            >
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

export default BookSetup;
