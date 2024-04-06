import React from "react";
import { Card, Col, Row, Divider } from "antd";
import {
  UserOutlined,
  BookOutlined,
  AuditOutlined,
  DatabaseOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { Bar } from "@ant-design/charts";
import { useFetchTransaction } from "../api/transaction/queries";
import { useFetchMember } from "../api/members/queries";
import { useFetchAuthor } from "../api/author/queries";
import { useFetchCategory } from "../api/category/queries";
import { useFetchBook } from "../api/book/queries";

const Charts: React.FC = () => {
  const { data: memberData } = useFetchMember();
  const { data: authorData } = useFetchAuthor();
  const { data: categoryData } = useFetchCategory();
  const { data: bookData } = useFetchBook();
  const { data: transactionData } = useFetchTransaction();

  const totalMembers = memberData?.length || 0;
  const totalAuthors = authorData?.length || 0;
  const totalCategories = categoryData?.length || 0;
  const totalBooks = bookData?.length || 0;

  let bookFrequency: { [key: string]: number } = {};
  let totalRentDuration = 0;
  let totalTransactions = 0;

  if (transactionData && Array.isArray(transactionData)) {
    transactionData.forEach(
      (transaction: { bookName: any; fromDate: any; toDate: any }) => {
        const { bookName, fromDate, toDate } = transaction;
        const rentDuration =
          new Date(toDate).getTime() - new Date(fromDate).getTime();

        if (!isNaN(rentDuration)) {
          bookFrequency[bookName] = (bookFrequency[bookName] || 0) + 1;
          totalRentDuration += rentDuration;
          totalTransactions++;
        }
      }
    );
  }

  const transactionStats = Object.keys(bookFrequency).map((book) => ({
    bookName: book,
    frequency: bookFrequency[book],
  }));

  transactionStats.sort((a, b) => b.frequency - a.frequency);

  const topBooks = transactionStats.slice(0, 5);

  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const averageRentDuration =
    totalTransactions > 0
      ? Math.ceil(totalRentDuration / (totalTransactions * millisecondsInADay))
      : 0;

  const barData = topBooks.map((book) => ({
    bookName: book.bookName,
    frequency: book.frequency,
  }));

  const barConfig = {
    data: barData,
    xField: "bookName",
    yField: "frequency",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        fontSize: 200,
        fontWeight: "bold",
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        style: {
          fontSize: 26,
          fontWeight: "bold",
        },
      },
    },
    meta: {
      bookName: { alias: "Book Name" },
      frequency: { alias: "Frequency" },
    },
  };

  return (
    <div className="flex-grow mx-10 mt-10">
      <Divider orientation="center">Stats</Divider>
      <Row gutter={16} justify="space-around">
        <Col span={4}>
          <Card className="bg-blue-200 hover:bg-blue-300 shadow-lg rounded-lg p-4">
            <UserOutlined className="text-6xl text-blue-500 mx-auto" />
            <p className="text-4xl font-bold text-center">{totalMembers}</p>
            <p className="text-black mt-2 font-semibold text-center">
              Total Members
            </p>
          </Card>
        </Col>
        <Col span={4}>
          <Card className="bg-green-200 hover:bg-green-300 shadow-lg rounded-lg p-4">
            <AuditOutlined className="text-6xl text-green-500 mx-auto" />
            <p className="text-4xl font-bold text-center">{totalAuthors}</p>
            <p className="text-black mt-2 font-semibold text-center">
              Total Authors
            </p>
          </Card>
        </Col>
        <Col span={4}>
          <Card className="bg-yellow-200 hover:bg-yellow-300 shadow-lg rounded-lg p-4">
            <DatabaseOutlined className="text-6xl text-yellow-500 mx-auto" />
            <p className="text-4xl font-bold text-center">{totalCategories}</p>
            <p className="text-black mt-2 font-semibold text-center">
              Total Categories
            </p>
          </Card>
        </Col>
        <Col span={4}>
          <Card className="bg-pink-200 hover:bg-pink-300 shadow-lg rounded-lg p-4">
            <BookOutlined className="text-6xl text-pink-500 mx-auto" />
            <p className="text-4xl font-bold text-center">{totalBooks}</p>
            <p className="text-black mt-2 font-semibold text-center">
              Total Books
            </p>
          </Card>
        </Col>
        <Col span={4}>
          <Card className="bg-purple-200 hover:bg-purple-300 shadow-lg rounded-lg p-4">
            <FieldTimeOutlined className="text-6xl text-purple-500 mx-auto" />
            <p className="text-4xl font-bold text-center">
              {averageRentDuration} days
            </p>
            <p className="text-black mt-2 font-semibold text-center">
              Average Rent Duration
            </p>
          </Card>
        </Col>
      </Row>
      <Divider orientation="center">Most Rented Books</Divider>
      <Row gutter={16} justify="center">
        <Col span={16}>
          <Bar {...barConfig} />
        </Col>
      </Row>
    </div>
  );
};

export default Charts;
