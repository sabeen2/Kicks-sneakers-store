import React, { useState, useEffect } from "react";
import { Breadcrumb, DatePicker, Space, Table } from "antd";
import type { TablePaginationConfig } from "antd";
import { ProductOutlined, DashboardOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

import { useFetchAllTransaction } from "../../api/order/queries";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";

interface ReturnDataType {
  id: string;
  name: string;
  code: string;
  to_date: string;
  from_date: string;
  member_name: string;
}

const columns = [
  {
    title: "SN",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "From Date",
    dataIndex: "from_date",
    key: "from_date",
    render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
  },
  {
    title: "To Date",
    dataIndex: "to_date",
    key: "to_date",
    render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
  },
  {
    title: "Member Name",
    dataIndex: "member_name",
    key: "member_name",
  },
];

const Return: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [transactionHistory, setTransactionHistory] = useState<
    ReturnDataType[] | any
  >(null);

  const { data: returnHistory, isLoading: returnLoading } =
    useFetchAllTransaction(
      pageNumber,
      pageSize,
      fromDate?.format("YYYY/MM/DD") || null,
      toDate?.format("YYYY/MM/DD") || null
    );

  useEffect(() => {
    setTransactionHistory(returnHistory?.content);
  }, [returnHistory]);

  console.log(transactionHistory);

  const handleDateChange = (value: RangePickerProps["value"]) => {
    if (!value) {
      setFromDate(undefined);
      setToDate(undefined);
      return;
    }

    setFromDate(dayjs(value?.[0]));
    setToDate(dayjs(value?.[1]));
  };

  const onTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    setPageNumber(current || 1);
    setPageSize(pageSize || 10);
  };

  return (
    <div className="flex-grow mx-10 mt-5 max-h-96">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">All Products</h2>
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
              <span>All Products</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Space direction="vertical" size={12}>
          <RangePicker
            className="border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            format="YYYY/MM/DD"
            onChange={handleDateChange}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        loading={returnLoading}
        dataSource={transactionHistory}
        pagination={{
          current: returnHistory?.currentPageIndex,
          total: returnHistory?.totalElements,
          pageSize: returnHistory?.numberOfElements,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 15, 20, 25, 30],
        }}
        onChange={onTableChange}
      />
    </div>
  );
};

export default Return;
