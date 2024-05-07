import React, { useState, useEffect } from "react";
import { Button, Drawer, Form } from "antd";
import axios from "axios";
import CreateAuthor from "./CreateAuthor";
import lol from "../../assets/image.png";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const onSuccessAdd = () => {
    closeDrawer();
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
        setProducts(response.data.data.content);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("bookRental");
        const updatedProducts = await Promise.all(
          products.map(async (product) => {
            const response = await axios.get(
              `https://orderayo.onrender.com/products/get-image-by-id?id=${product.prodid}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  accept: "*/*",
                },
                responseType: "blob", // Set responseType to 'blob' to receive Blob response
              }
            );

            const blob = new Blob([response.data], {
              type: response.headers["content-type"],
            });
            const imageUrl = URL.createObjectURL(blob); // Convert Blob to data URL

            return { ...product, imageUrl };
          })
        );
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    // Fetch images only if products exist
    if (products.length > 0) {
      fetchImages();
    }
  }, [products]); // Fetch images whenever products change

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
      <div className="flex flex-grow flex-wrap gap-4">
        {products.map((product) => (
          <div
            key={product.prodid}
            className=" overflow-hidden shadow-md bg-white rounded-2xl w-[vh] "
          >
            <div className="aspect-w-4 aspect-h-3 px-4 ">
              <img
                src={product.image || lol}
                alt={` ${product.prodname.value}`}
                className="object-cover w-[15rem]"
              />
              <h3 className=" uppercase text-lg font-semibold mb-2">
                {product.prodname.value}
              </h3>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-2"> TYPE:{product.prodtype}</p>
              {/* <p className="text-gray-600 mb-2">Product ID: {product.prodid}</p> */}
              <p className="text-gray-600 mb-2">
                Available Stock: {product.availablestock}
              </p>
              <p className="text-gray-600 mb-2">
                Cost Price: NRP {product.costprice}
              </p>
              <p className="text-gray-600 mb-2">
                Selling Price: NRP {product.sellingprice}
              </p>
              {/* <p className="text-gray-600">Modified By: {product.modifiedby}</p> */}
            </div>
          </div>
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
