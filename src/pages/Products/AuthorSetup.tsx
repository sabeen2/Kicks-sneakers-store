import React, { useState, useEffect } from "react";
import { Button, Drawer, Form, message, Card } from "antd";
import CreateAuthor from "./CreateAuthor";
import { useFetchAuthor, useGetAllProducts } from "../../api/product/queries";
import ImageCard from "./imagePreview";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  products;

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const onSuccessAdd = () => {
    closeDrawer();
  };

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const token = localStorage.getItem("bookRental");
  //       const updatedProducts = await Promise.all(
  //         products.map(async (product) => {
  //           const response = await axios.get(
  //             `https://orderayo.onrender.com/products/get-image-by-id?id=${prprodId?: anyprodId: anyoduct.prodid}`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //                 accept: "*/*",
  //               },
  //               responseType: "blob",
  //             }
  //           );

  //           const blob = new Blob([response.data], {
  //             type: response.headers["content-type"],
  //           });
  //           const imageUrl = URL.createObjectURL(blob);

  //           return { ...product, imageUrl };
  //         })
  //       );
  //       setProducts(updatedProducts);
  //     } catch (error) {
  //       console.error("Error fetching images:", error);
  //     }
  //   };

  //   // Fetch images only if products exist
  //   if (products.length > 0) {
  //     fetchImages();
  //   }
  // }, [products]); // Fetch images whenever products change

  // const { data: imageData } = useFetchImage(prodId);

  // const { data: imageData } = useFetchImage(prodId);
  // const { data: imageBaseData } = useFetchImageBase(prodId);
  const { mutate: getProducts } = useFetchAuthor();

  // const imageFile = `data:image/jpeg;base64, ${imageBaseData}`;

  const { data: allProductsData } = useGetAllProducts();

  useEffect(() => {
    getProducts(
      {},
      {
        onSuccess: (resData) => {
          setProducts(resData.content);
        },
        onError: (data) => {
          message.error(`Failed to get products ${data}`);
        },
      }
    );
  }, []);

  // console.log({ products });

  return (
    <div className="mx-auto container">
      <div className="flex justify-end mb-6">
        <Button
          className="bg-black text-white font-semibold"
          onClick={showDrawer}
        >
          Add Products
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-x-6 gap-y-6">
        {allProductsData?.map((item: any, index: any) => (
          <Card
            key={index}
            className=" bg-white rounded-lg shadow-md overflow-hidden "
          >
            <div className="relative">
              <ImageCard
                id={item.prodid || item.prodId}
                key={item.prodid || item.prodId}
              />

              <div>{item?.prodId || item?.prodid}</div>

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
            </div>
          </Card>
        ))}
      </div>
      <Drawer
        title="Add Product"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={400}
      >
        <CreateAuthor onSucess={onSuccessAdd} form={form} />
      </Drawer>
    </div>
  );
};

export default ProductList;
