import React, { useState } from "react";
import { Button, Drawer, Form, Card, Pagination, Modal } from "antd";
import CreateAuthor from "./CreateAuthor";
import { useFetchAuthor } from "../../api/product/queries";
import ImageCard from "./imagePreview";
import CreateTransaction from "../Order/RentForm";

const ProductList: React.FC = () => {
  // const [products, setProducts] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<any>([]);
  const [pageSize, setPageSize] = useState(10);
  const [thisSelectedProduct, setThisSelectedProduct] = useState<any>([]);

  const [page, setPage] = useState(1);
  setPageSize;
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  const handleCancel = () => {
    setIsModalOpen(false);
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

  const { data: productData, refetch: refetchProducts } = useFetchAuthor({
    row: pageSize,
    page: page,
  });

  const createOrder = (currentOrder: any) => {
    setThisSelectedProduct(currentOrder);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto container h-screen ">
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
            className=" bg-white rounded-lg shadow-md overflow-hidden  "
          >
            <div className="relative">
              <ImageCard
                id={item.prodid || item.prodId}
                key={item.prodid || item.prodId}
              />
              <div className="absolute top-2 right-0 bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium">
                {item?.prodtype || item?.prodType}
              </div>
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
                key={item?.prodid}
                onClick={() => {
                  showEditDrawer(item);
                }}
                className="mt-4 border-black border  bg-slate-100 hover:bg-white hover:scale-105 rounded-lg px-3 py-1 hover  "
              >
                Edit
              </button>
              <button
                key={item?.prodid}
                onClick={() => {
                  createOrder(item);
                }}
                className="mt-4 ml-2 border-black border bg-black text-white font-medium hover:bg-white  hover:text-black duration delay-100 hover:scale-105 rounded-lg px-2 py-1 hover  "
              >
                Create Order
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
