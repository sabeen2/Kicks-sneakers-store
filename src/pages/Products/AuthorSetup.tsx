import React, { useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Card,
  Pagination,
  Modal,
  message,
  Input,
} from "antd";
import { useDeleteProducts, useFetchAuthor } from "../../api/product/queries";
import ImageCard from "./imagePreview";
import CreateTransaction from "../Order/RentForm";
import { DeleteOutlined } from "@ant-design/icons";
import CreateAuthor from "./CreateAuthor";

const ProductList: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<any>();
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState<string>("");
  const [thisSelectedProduct, setThisSelectedProduct] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  let deleted = false;

  const { data: productData, refetch: refetchProducts } = useFetchAuthor({
    isDeleted: deleted,
    name: searchText,
    row: pageSize,
    page: page,
  });

  const { mutate: deleteProd } = useDeleteProducts();

  const onFinishSearch = (data: any) => {
    setSearchText(data.searchInput);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    form.resetFields();
    refetchProducts();
    setSelectedAuthor(null);
  };

  const onSuccessAdd = () => {
    closeDrawer();
    setIsModalOpen(false);
  };

  const showEditDrawer = (thisProduct: any) => {
    setSelectedAuthor(thisProduct);
    setDrawerVisible(true);
  };

  const createOrder = (currentOrder: any) => {
    setThisSelectedProduct(currentOrder);

    setIsModalOpen(true);
  };

  const deleteOrder = (currentOrder: any) => {
    console.log(currentOrder);
    deleteProd(currentOrder, {
      onSuccess: () => {
        message.success("Successfully Deleted");
      },
      onError: (error) => {
        message.error(`Failed Deleting ${error}`);
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto container h-screen">
      <div className="w-60 mb-4 mt-2">
        <Form
          onFinish={onFinishSearch}
          form={searchForm}
          className="flex gap-x-4"
        >
          <Form.Item name="searchInput">
            <Input
              placeholder="Search"
              className="border-2 border-blue-500 focus:border-blue-700 rounded-md  outline-none font-extrabold"
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="bg-blue-700 text-white  hover:border-[1px] hover:border-gray-600 hover:text-black"
              type="default"
              htmlType="submit"
            >
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="flex justify-end mb-6">
        <Button
          className="bg-black text-white font-semibold"
          onClick={showDrawer}
        >
          Add Products
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-x-6 gap-y-6">
        {productData?.content?.map((item: any, index: any) => (
          <Card
            size="small"
            key={index}
            className={`bg-white rounded-lg shadow-md overflow-hidden`}
          >
            <div className="relative">
              <ImageCard
                id={item.prodid || item.prodId}
                key={item.prodid || item.prodId}
              />
              {item?.deleted || item?.availablestock === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold">
                  Out of Stock
                </div>
              ) : null}
            </div>

            <div className="p-4">
              <h3 className="text-base font-semibold mb-1">
                {item?.prodname?.value || item?.prodName}
              </h3>
              <div className="flex items-center mb-2">
                <span className="text-gray-500 mr-1 text-sm">In Stock:</span>
                <span className="text-gray-900 font-medium text-sm">
                  {item?.availablestock || item?.availableStock}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-gray-500 mr-1 text-sm">Cost Price:</span>
                <span className="text-gray-900 font-medium text-sm">
                  {item?.costprice || item?.costPrice}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-gray-500 mr-1 text-sm">
                  Selling Price:
                </span>
                <span className="text-gray-900 font-medium text-sm">
                  {item?.sellingprice || item?.sellingPrice}
                </span>
              </div>
              <button
                onClick={() => showEditDrawer(item)}
                className={`mt-4 border-black border bg-slate-100 hover:bg-white hover:scale-105 rounded-lg px-3 py-1 `}
              >
                Edit
              </button>
              <button
                onClick={() => createOrder(item)}
                disabled={
                  item?.deleted || item?.availablestock === 0 ? true : false
                }
                className={`mt-4 ml-2 border-black border bg-black text-white font-medium hover:bg-white hover:text-black rounded-lg px-2 py-1 ${
                  item?.deleted || item?.availablestock === 0
                    ? "opacity-30"
                    : ""
                }`}
              >
                Create Order
              </button>
              <button
                onClick={() => deleteOrder(item.prodid)}
                disabled={
                  item?.deleted || item?.availablestock === 0 ? true : false
                }
                className={`mt-4 ml-2 bg-red-600 text-white font-medium hover:bg-white hover:text-black rounded-lg px-2 py-1 ${
                  item?.deleted || item?.availablestock === 0
                    ? "opacity-30"
                    : ""
                }`}
              >
                <DeleteOutlined />
              </button>
            </div>
          </Card>
        ))}
      </div>
      <Pagination
        className="mt-4 flex justify-end"
        pageSize={pageSize}
        current={page}
        onChange={(currentPage) => {
          setPage(currentPage);
        }}
        total={productData?.totalElements}
      />

      <Drawer
        title={selectedAuthor ? "Edit product" : "Create Product"}
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={400}
      >
        <CreateAuthor
          selectedAuthor={selectedAuthor}
          onSucess={onSuccessAdd}
          form={form}
        />
      </Drawer>
      <Modal
        title="Create Order"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width={600}
      >
        <CreateTransaction
          form={form}
          onSucess={onSuccessAdd}
          thisSelectedProduct={thisSelectedProduct}
        />
      </Modal>
    </div>
  );
};
export default ProductList;
