import { Button, Card, Form, Input, Modal, Table, message } from "antd";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {
  useFetchOrderHistory,
  useFetchBestSellers,
  useFetchSalesReport,
  useFetchTransaction,
} from "../api/order/queries";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import ImageCard from "./imagePreview";
import axios from "axios";

Chart.register(CategoryScale);

export default function Charts() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const { data: activeOrders } = useFetchTransaction();
  const { data: getOrderHistory } = useFetchOrderHistory();
  console.log();

  // if (activeOrders && activeOrders.length > 0) {
  //   activeOrders.forEach((order: { products: any[] }) => {
  //     order.products.forEach((product) => {
  //       const productType = product.productType;
  //       console.log(productType);
  //       // Do whatever you need with productType here
  //     });
  //   });
  // }
  const { mutate: mutateSalesReport, data: salesReportData } =
    useFetchSalesReport();
  const { mutate: mutateBestSeller, data: bestSellerData } =
    useFetchBestSellers();
  // const bestInside = bestSellerData?
  useEffect(() => {
    mutateBestSeller({});
    mutateSalesReport({});
  }, []);

  const cardData = [
    {
      title: "Total Orders",
      value: getOrderHistory?.length + activeOrders?.length,
      amt: salesReportData?.shipped_orders,
    },
    {
      title: "Active Orders",
      value: activeOrders?.length,
      amt: salesReportData?.active_orders,
    },
    {
      title: "Dispatched Orders",
      value: getOrderHistory?.length,
      amt: salesReportData?.shipped_orders,
    },
  ];

  // const tableData = [
  //   {
  //     order: activeOrders?.orderId,
  //     customer: "Olivia Martin",
  //     date: "February 20, 2022",
  //     amount: "$42.25",
  //     status: "Shipped",
  //   },
  //   {
  //     order: "#3209",
  //     customer: "Ava Johnson",
  //     date: "January 5, 2022",
  //     amount: "$74.99",
  //     status: "Paid",
  //   },
  //   {
  //     order: "#3204",
  //     customer: "Michael Johnson",
  //     date: "August 3, 2021",
  //     amount: "$64.75",
  //     status: "Unfulfilled",
  //   },
  //   {
  //     order: "#3203",
  //     customer: "Lisa Anderson",
  //     date: "July 15, 2021",
  //     amount: "$34.50",
  //     status: "Shipped",
  //   },
  //   {
  //     order: "#3202",
  //     customer: "Samantha Green",
  //     date: "June 5, 2021",
  //     amount: "$89.99",
  //     status: "Paid",
  //   },
  // ];

  // const { mutate: sendMail } = useSendMail();
  // const onMailSend = (values: any) => {
  //   sendMail(values, {
  //     onSuccess: () => {
  //       message.success("SucessFully Sent");
  //     },
  //     onError: (data:any) => {
  //       message.error(data);
  //     },
  //   });
  // };

  const onMailSend = async (values: any) => {
    try {
      setLoading(true);
      const { to, subject, message } = values;
      const token = localStorage.getItem("bookRental");

      const url = `https://orderayo.onrender.com/mail/send-mail?to=${encodeURIComponent(
        to
      )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        message
      )}`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      form.resetFields();
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Failed to send email. Please try again later.");
    } finally {
      setLoading(false);
      form.resetFields();
      message.success("Email sent successfully!");
    }
  };

  return (
    <div className=" h-[90%]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cardData?.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {card.value} units, Rs {card.amt}
              </div>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.increase}
                </p> */}
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="mb-4">
        <button
          onClick={showModal}
          className=" text-white bg-black px-2 py-1 hover:bg-white hover:text-black hover:border-[1px] hover:border-black duration-500 rounded-lg absolute top-[14rem] right-[4rem] "
        >
          Send Mail
        </button>
        <h2 className="text-2xl font-bold mb-4">Top Selling Shoes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {bestSellerData?.map((shoe: any, index: number) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2"
            >
              <Link className="absolute inset-0 z-10" to="#">
                <span className="sr-only">View</span>
              </Link>

              <ImageCard id={shoe?.product_id} key={shoe?.product_id} />
              <div className="bg-white p-4 dark:bg-gray-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span key={index} className="font-bold text-white">
                    {shoe?.name?.value}
                  </span>
                  , Sold Unit: {shoe?.order_count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
        <Card>
          <CardHeader>
            <CardTitle>Sales Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>
        <Card size="small">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              size="small"
              dataSource={activeOrders}
              pagination={{ pageSize: 5 }}
            >
              <Table.Column title="OrderID" dataIndex="orderId" key="orderId" />
              <Table.Column
                title="CustomerName"
                dataIndex="customerName"
                key="customer"
              />
              <Table.Column
                title="Order Date"
                dataIndex="orderDate"
                key="date"
              />
              <Table.Column
                title="ProductName"
                dataIndex="products"
                render={(products) => {
                  return products[0]?.productName;
                }}
                key="products"
              />
              <Table.Column
                title="Total Amount"
                dataIndex="total"
                key="status"
              />
            </Table>
          </CardContent>
        </Card>
      </div>

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Compose Email</h2>
          <Form name="simple_form" onFinish={onMailSend}>
            <Form.Item
              name="to"
              // label="To:"
              rules={[
                { required: true, message: "Please enter recipient email!" },
              ]}
            >
              <Input
                className="border-2 rounded-lg focus:border-blue-500"
                placeholder="Enter recipient email"
              />
            </Form.Item>
            <Form.Item
              name="subject"
              // label="Subject:"
              rules={[{ required: true, message: "Please enter subject!" }]}
            >
              <Input
                className="border-2 rounded-lg focus:border-blue-500"
                placeholder="Enter subject"
              />
            </Form.Item>
            <Form.Item
              name="message"
              // label="Message:"
              rules={[{ required: true, message: "Please enter message!" }]}
            >
              <Input.TextArea
                className="border-2 rounded-lg focus:border-blue-500"
                rows={4}
                placeholder="Enter message"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 hover:bg-blue-500 duration-300 rounded-lg"
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

function CardHeader({ children }: any) {
  return (
    <div className="flex items-center justify-between h-2">{children}</div>
  );
}

function CardTitle({ children }: any) {
  return <h3 className="font-bold h-2">{children}</h3>;
}

function CardContent({ children }: any) {
  return <div className="p-4">{children}</div>;
}

const LineChart: React.FC = () => {
  const { data: activeOrders } = useFetchTransaction();
  const [productTypeCounts, setProductTypeCounts] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (activeOrders) {
      const counts: { [key: string]: number } = {};

      activeOrders.forEach((order: { products: any[] }) => {
        order.products.forEach((product: { productType: string | number }) => {
          counts[product.productType] = (counts[product.productType] || 0) + 1;
        });
      });

      setProductTypeCounts(counts);
    }
  }, [activeOrders]);

  const chartData = {
    labels: Object.keys(productTypeCounts),
    datasets: [
      {
        data: Object.values(productTypeCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"], // You can add more colors if needed
      },
    ],
  };

  return (
    <div className=" p-0 w-full max-w-[18rem] mx-auto">
      <Doughnut data={chartData} />
    </div>
  );
};

//Line Graph code

// const LineChart: React.FC = () => {
//   const { data: activeOrders } = useFetchTransaction();
//   const [productTypeCounts, setProductTypeCounts] = useState<{
//     [key: string]: number;
//   }>({});

//   useEffect(() => {
//     if (activeOrders) {
//       const counts: { [key: string]: number } = {};

//       activeOrders.forEach((order: { products: any[] }) => {
//         order.products.forEach((product: { productType: string | number }) => {
//           counts[product.productType] = (counts[product.productType] || 0) + 1;
//         });
//       });

//       setProductTypeCounts(counts);
//     }
//   }, [activeOrders]);

//   const chartData = {
//     labels: Object.keys(productTypeCounts),
//     datasets: [
//       {
//         label: "Product Type Counts",
//         data: Object.values(productTypeCounts),
//         fill: false,
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.1,
//       },
//     ],
//   };

//   return (
//     <div className="w-full max-w-lg mx-auto">
//       <Line data={chartData} />
//     </div>
//   );
// };
