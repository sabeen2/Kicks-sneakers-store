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
  Breadcrumb,
} from "antd";
import type { TableProps } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { ProductOutlined, DashboardOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

import CreateTransaction from "./RentForm";

import {
  useFetchTransaction,
  useFindTransactionById,
  useDownloadTransactionDetails,
  useUploadTransactionDetails,
  useGetBill,
  useDeleteTransaction,
} from "../../api/order/queries";
import moment from "moment";

// interface TransactionDataType {
//   id: any;
//   bookName: string;
//   code: any;
//   fromDate: any;

//   toDate: any;
//   transactionType: any;
//   prodId: number;
//   productName: string;
//   productType: string;
//   quantity: number;
//   price: number;
// }

interface ProductDataType {
  selectedAuthor: any[];
  prodId: number;
  productName: string;
  productType: string;
  quantity: number;
  price: number;
}

interface OrderDataType {
  selectedAuthor: any[];
  prodId(prodId: any): void;
  orderId: number;
  customerName: string;
  customerContact: string;
  products: ProductDataType[];
  total: number;
  orderDate: string;
}

const Order: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    OrderDataType | any
  >(null);
  const [findTheTransaction, setFindTheTransaction] = useState<
    OrderDataType | any
  >(null);
  const [findByName, setFindByName] = useState<OrderDataType | any>(null);
  const [inputValueIsNumber, setInputValueIsNumber] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();
  const [uploadForm] = Form.useForm();

  const [searchedTransactionId, setSearchedTransactionId] = useState<
    OrderDataType | any
  >("");
  // const [setPage] = React.useState(1);

  const columns: TableProps<OrderDataType>["columns"] = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Quantity",
      dataIndex: "products",
      key: "quantity",
      render: (products: ProductDataType[]) =>
        products.map((product) => product.quantity).join(", "),
    },
    {
      title: "Contact",
      dataIndex: "customerContact",
      key: "customerContact",
    },

    {
      title: "Customer Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Product Name",
      dataIndex: "products",
      key: "productName",
      render: (products: ProductDataType[]) =>
        products.map((product) => product.productName).join(", "),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate: string) => {
        const now = moment();
        const orderMoment = moment(orderDate);
        const hoursPassed = now.diff(orderMoment, "hours");

        // Calculate color intensity based on the hours passed
        const redIntensity = Math.min(
          255,
          Math.floor((hoursPassed / 24) * 255)
        );
        const backgroundColor = `rgb(255, ${255 - redIntensity}, ${
          255 - redIntensity
        })`;

        return (
          <div
            className="px-4 py-1 inline-flex rounded-lg text-white font-bold"
            style={{
              backgroundColor,
              // padding: "0.5rem",
              // borderRadius: "1rem",
              // color: "white",
            }}
          >
            {orderMoment.format("YYYY-MM-DD ")}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            className="mb-2 px-8 "
            onClick={() => showEditDrawer(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title={
              <span style={{ fontSize: "20px" }}>
                Are you sure you want to dispatch?
              </span>
            }
            onConfirm={() => handleReturn(record.orderId)}
            okText={<span className=" w-10">Yes</span>}
            cancelText={<span className=" w-10">No</span>}
            okButtonProps={{ danger: true }}
            overlayStyle={{ width: "400px", height: "100px" }}
          >
            <button className=" text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5  text-center me-2 mb-2 py-2">
              Dispatch
            </button>
          </Popconfirm>
          <Popconfirm
            title={
              <span style={{ fontSize: "20px" }}>
                Generating report will dispatch order as well, Are you sure?
              </span>
            }
            onConfirm={() => handleGetBill(record.orderId)}
            okText={<span className=" w-10">Yes</span>}
            cancelText={<span className=" w-10">No</span>}
            okButtonProps={{ danger: true }}
            overlayStyle={{ width: "400px", height: "100px" }}
          >
            <button className=" text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5  text-center me-2 mb-2 py-2">
              Generate Bill
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showEditDrawer = (transaction: OrderDataType) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchTransaction();
    setSelectedTransaction(null);
    setSearchedTransactionId(searchedTransactionId);
  };

  const { mutate: dispatchOrder } = useDeleteTransaction();

  // const handleReturn = (transactionID: any) => {
  //   let payload: any = {
  //     id: transactionID,
  //     // rentType: "RETURN",
  //   };
  //   returnTransaction(payload, {
  //     onSuccess: () => {
  //       message.success(`Returned Book Successfully `);
  //       setFindTheTransaction(null);
  //       refetchTransaction();
  //     },
  //     onError: (errorMsg: any) => {
  //       message.error(errorMsg);
  //     },
  //   });
  // };

  const handleReturn = (orderID: any) => {
    // console.log(orderID);
    dispatchOrder(orderID, {
      onSuccess: () => {
        message.success("SuccessFully Dispached");
      },
      onError: (data) => {
        message.error(`Failed:  ${data}`);
      },
    });
  };

  const { mutate: generateBill } = useGetBill();

  const handleGetBill = (orderID: any) => {
    generateBill(orderID, {
      onSuccess: (base64Data) => {
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "bill.pdf";
        link.click();
      },
      onError: (error) => {
        message.error(`Failed to Download: ${error}`);
      },
    });
  };

  const { mutate: downloadTransactions } = useDownloadTransactionDetails();

  const handleDownloadTransactionDetails = () => {
    downloadTransactions(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "orderDetails.xls";
        link.click();
      },
      onError: (data) => {
        message.error(`Failed to Download: ${data}`);
      },
    });
  };

  const {
    data: transactionData,
    isLoading: isLoadingTransactionData,
    refetch: refetchTransaction,
  } = useFetchTransaction();

  const { data: findTransaction, refetch: refetchFindTransaction } =
    useFindTransactionById(searchedTransactionId);

  const searchById = (values: any) => {
    setSearchedTransactionId(values.transactionId.trim());
  };

  const handleNameChange = (event: any) => {
    if (event.target.value === "") {
      setFindTheTransaction(null);
      setSearchedTransactionId("");
      setInputValueIsNumber(false);
    } else if (!isNaN(event.target.value)) {
      setInputValueIsNumber(true);
    }
    setSearchText(event.target.value.trim());
  };

  useEffect(() => {
    const searchedTransactions = transactionData?.filter(
      (transaction: OrderDataType) => {
        return Object.values(transaction).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        );
      }
    );
    setFindByName(searchedTransactions);
  }, [searchText, transactionData]);

  useEffect(() => {
    if (searchedTransactionId) {
      setFindTheTransaction(findTransaction);
      refetchFindTransaction();
    }
  }, [searchedTransactionId, refetchFindTransaction, findTransaction]);

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
  const { mutate: uploadTransaction } = useUploadTransactionDetails();

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
    uploadTransaction(payload, {
      onSuccess: () => {
        message.success(`Sucessfully uploaded `);
        setIsModalOpen(false);
        refetchTransaction();
      },
      onError: (data) => {
        message.error(`Failed ${data}`);
      },
    });
  };

  return (
    <div className="flex-grow mx-10 mt-5 max-h-96">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Order List</h2>
          <Breadcrumb
            separator={<span style={{ color: "black" }}>/</span>}
            className="bg-indigo-100 my-4 rounded-lg p-2 text-xs inline-flex text-black"
          >
            <Breadcrumb.Item>
              <DashboardOutlined />
              <span>Dashboard</span>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <ProductOutlined />
              <span>All Orders</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
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
          title={
            selectedTransaction ? "Edit Transaction" : "Create Transaction"
          }
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <CreateTransaction
              selectedTransaction={selectedTransaction}
              form={form}
              onSucess={onClose}
            />
          </div>

          {/* <Form
            form={addForm}
            name="Order Setup"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinishAdd}
            autoComplete="off"
          >
            <Form.Item
              label="Customer Name"
              name="customerName"
              rules={[
                { required: true, message: "Please enter customer name" },
              ]}
            >
              <Input className="w-full" />
            </Form.Item>
            <Form.Item
              label="Customer Contact"
              name="customerContact"
              rules={[
                { required: true, message: "Please enter customer contact" },
              ]}
            >
              <Input className="w-full" />
            </Form.Item>
            <Form.Item
              label="Customer Address"
              name="address"
              rules={[
                { required: false, message: "Please enter customer address" },
              ]}
            >
              <Input className="w-full" />
            </Form.Item>
            <Form.Item
              label="Customer Email"
              name="customerEmail"
              rules={[
                {
                  required: false,
                  type: "email",
                  message: "Please enter valid customer Email",
                },
              ]}
            >
              <Input className="w-full" />
            </Form.Item>

            <Form.List name="products">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "product"]}
                        fieldKey={[fieldKey, "product"]}
                        rules={[
                          {
                            required: true,
                            message: "Please select a product",
                          },
                        ]}
                      >
                        <Select placeholder="Select product" className="w-full">
                          {productsList.map(
                            (product: { prodId: any; prodName: any }) => (
                              <Option
                                key={product.prodId}
                                value={product.prodId}
                              >
                                {product.prodName}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        fieldKey={[fieldKey, "quantity"]}
                        rules={[
                          { required: true, message: "Please enter quantity" },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          placeholder="Quantity"
                          className="w-full"
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Product
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item>
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
                  onClick={() => form.resetFields()}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form> */}
        </Drawer>
      </div>
      <div className=" flex flex-wrap items-center">
        <Form
          form={inputForm}
          onFinish={searchById}
          className="flex items-center mb-0"
        >
          <Form.Item name="transactionId" className="mr-2 w-50">
            <Input
              placeholder="Search"
              value={
                searchedTransactionId
                  ? searchedTransactionId
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
        size="small"
        columns={columns}
        dataSource={
          findTheTransaction
            ? [findTheTransaction]
            : findByName
            ? findByName
            : transactionData
        }
        loading={isLoadingTransactionData}
        rowKey="id"
        pagination={{
          pageSize: 7,
          responsive: true,
          onChange() {},
        }}
      />

      <Button
        className=" mb-4 hidden bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        type="default"
        onClick={handleDownloadTransactionDetails}
        icon={<DownloadOutlined />}
      >
        Download Order Details
      </Button>

      <Button
        className="ml-4 bg-blue-500  text-white font-bold px-2 rounded hidden"
        icon={<UploadOutlined />}
        onClick={showModal}
      >
        Upload Transaction Data in Excel
      </Button>

      <Modal
        footer
        title="Upload Transaction Data"
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

export default Order;
