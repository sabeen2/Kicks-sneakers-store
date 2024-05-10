import { Card, Table } from "antd";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useFetchTransaction } from "../api/order/queries";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";

Chart.register(CategoryScale);

export default function Charts() {
  // const { data: activeOrders } = useFetchTransaction();

  // if (activeOrders && activeOrders.length > 0) {
  //   activeOrders.forEach((order: { products: any[] }) => {
  //     order.products.forEach((product) => {
  //       const productType = product.productType;
  //       console.log(productType);
  //       // Do whatever you need with productType here
  //     });
  //   });
  // }

  // Static data for cards and table
  const cardData = [
    { title: "Total Orders", value: "2,345", increase: "+12% from last month" },
    { title: "Active Orders", value: "567", increase: "+5% from last month" },
    {
      title: "Shipped Orders",
      value: "1,789",
      increase: "+8% from last month",
    },
  ];

  const shoeData = [
    {
      name: "Nike Air Force 1",
      description: "Classic sneaker",
      price: "$89.99",
      image: "/placeholder.svg",
    },
    {
      name: "Adidas Ultraboost",
      description: "Comfortable and stylish",
      price: "$129.99",
      image: "/placeholder.svg",
    },
    {
      name: "Converse Chuck Taylor",
      description: "Iconic canvas sneaker",
      price: "$59.99",
      image: "/placeholder.svg",
    },
  ];

  const tableData = [
    {
      order: "#3210",
      customer: "Olivia Martin",
      date: "February 20, 2022",
      amount: "$42.25",
      status: "Shipped",
    },
    {
      order: "#3209",
      customer: "Ava Johnson",
      date: "January 5, 2022",
      amount: "$74.99",
      status: "Paid",
    },
    {
      order: "#3204",
      customer: "Michael Johnson",
      date: "August 3, 2021",
      amount: "$64.75",
      status: "Unfulfilled",
    },
    {
      order: "#3203",
      customer: "Lisa Anderson",
      date: "July 15, 2021",
      amount: "$34.50",
      status: "Shipped",
    },
    {
      order: "#3202",
      customer: "Samantha Green",
      date: "June 5, 2021",
      amount: "$89.99",
      status: "Paid",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cardData.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.increase}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Top Selling Shoes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {shoeData.map((shoe, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2"
            >
              <Link className="absolute inset-0 z-10" to="#">
                <span className="sr-only">View</span>
              </Link>
              <img
                alt={`Shoe ${index + 1}`}
                className="object-cover w-full h-48 group-hover:opacity-50 transition-opacity"
                height={300}
                src={shoe.image}
                style={{ aspectRatio: "300/300", objectFit: "cover" }}
                width={300}
              />
              <div className="bg-white p-4 dark:bg-gray-950">
                <h3 className="font-bold text-lg">{shoe.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {shoe.description}
                </p>
                <h4 className="font-semibold text-xl">{shoe.price}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table dataSource={tableData} pagination={false}>
              <Table.Column title="Order" dataIndex="order" key="order" />
              <Table.Column
                title="Customer"
                dataIndex="customer"
                key="customer"
              />
              <Table.Column title="Date" dataIndex="date" key="date" />
              <Table.Column title="Amount" dataIndex="amount" key="amount" />
              <Table.Column title="Status" dataIndex="status" key="status" />
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function CardHeader({ children }: any) {
  return <div className="flex items-center justify-between">{children}</div>;
}

function CardTitle({ children }: any) {
  return <h3 className="font-bold">{children}</h3>;
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
    <div className="w-full max-w-lg mx-auto">
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
