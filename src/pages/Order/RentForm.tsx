import React, { useEffect } from "react";
import { Button, Form, Input, Space, message, Select, InputNumber } from "antd";
import { useAddTransaction } from "../../api/order/queries";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetAllProducts } from "../../api/product/queries";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface TransactionDataType {
  orderId?: any;
  quantity: any;
  productId: any;
  products: any;
  customerName: any;
  customerEmail: any;
  address: any;
  customerContact: any;
  orderItems: { productId: any; quantity: any }[];
}

interface PayloadType {
  customerName: any;
  customerEmail: any;
  address: any;
  customerContact: any;
  orderItems: { productId: any; quantity: any }[];
  orderId?: any;
}

interface CreateTransactionProps {
  setSelectedTransaction?: TransactionDataType | null | undefined;
  selectedTransaction?: TransactionDataType | null | undefined;
  form?: any;
  onSucess?: any;
  thisSelectedProduct?: any;
}

const CreateTransaction: React.FC<CreateTransactionProps> = ({
  selectedTransaction,
  form,
  onSucess,
  thisSelectedProduct,
}) => {
  const { mutate: addTransaction, isLoading: isAddingTransaction } =
    useAddTransaction();

  const onFinish = (values: any) => {
    let payload: PayloadType = {
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      address: values.address,
      customerContact: values.customerContact,
      orderItems: values.orderItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        // Add the 'id' field if 'selectedTransaction' is defined
        ...(selectedTransaction ? { id: item.id } : {}),
      })),
    };

    if (selectedTransaction) {
      console.log(selectedTransaction);
      payload = {
        ...payload,
        orderId: selectedTransaction.orderId,
      };
    }

    // else if (isSele)
    addTransaction(payload, {
      onSuccess: (data: any) => {
        message.success(
          `Transaction successfully ${
            selectedTransaction ? "edited" : "added"
          }: ${data}`
        );
        onSucess();
      },
      onError: (errorMessage: any) => {
        message.error(`Failed: ${errorMessage}`);
      },
    });
  };

  useEffect(() => {
    if (selectedTransaction) {
      form.setFieldsValue({
        ...selectedTransaction,
        orderItems: selectedTransaction?.products?.map((product: any) => ({
          id: product.orderItems,
          productId: product.prodId,
          quantity: product.quantity,
        })),
      });
    } else if (thisSelectedProduct) {
      form.setFieldsValue({
        orderItems: [
          {
            productId: thisSelectedProduct.prodid,
            quantity: 1,
          },
        ],
      });
    }
  }, [selectedTransaction, thisSelectedProduct, form]);

  const { data: nonPaginatedProducts } = useGetAllProducts();

  // console.log(thisSelectedProduct?.map((items) => console.log(items)));

  console.log(thisSelectedProduct);

  return (
    <div className="bg-white p-6 rounded">
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: "Please enter customer name" }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          label="Customer Contact"
          name="customerContact"
          rules={[{ required: true, message: "Please enter customer contact" }]}
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

        <Form.List name="orderItems">
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
                    name={[name, "productId"]}
                    rules={[
                      { required: true, message: "Please select a product" },
                    ]}
                    className="w-48 ml-48"
                  >
                    <Select placeholder="Select a product">
                      {nonPaginatedProducts?.map((product: any) => (
                        <Select.Option
                          key={product.prodId}
                          value={product.prodId}
                        >
                          {product.prodName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[
                      { required: true, message: "Please enter quantity" },
                    ]}
                  >
                    <InputNumber min={1} placeholder="Quantity" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  className="ml-48"
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

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              loading={isAddingTransaction}
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
      </Form>
    </div>
  );
};

export default CreateTransaction;
