import React, { useState } from "react";

import {
  UserOutlined,
  BookOutlined,
  ProductOutlined,
  OrderedListOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number] & {
  component?: React.ReactNode;
};

const currentRole = localStorage.getItem("userRole");

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  link?: string,
  component?: React.ReactNode
): MenuItem {
  return {
    key,
    icon,
    children,
    label: link ? <Link to={link}>{label}</Link> : label,
    component,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Dashboard", "1", <DashboardOutlined />, undefined, "/"),
  getItem("Products", "sub1", <ProductOutlined />, [
    getItem("All Products", "3", undefined, undefined, "all-products"),
    // getItem("Category Setup", "4", undefined, undefined, "category-setup"),
    // getItem("Member Setup", "5", undefined, undefined, "member-setup"),
    // getItem("Book Setup", "6", undefined, undefined, "book-setup"),
  ]),
  getItem("Orders", "sub2", <BookOutlined />, [
    getItem("Order List", "7", undefined, undefined, "order-list"),
    getItem(
      "Potential Customers",
      "11",
      undefined,
      undefined,
      "potential-customers"
    ),
  ]),
  getItem(
    "Order History",
    "9",
    <OrderedListOutlined />,
    undefined,
    "order-history"
  ),
];
if (currentRole === "ADMIN") {
  items.push(
    getItem("Manage Users", "10", <UserOutlined />, undefined, "manage-users")
  );
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<React.ReactNode | null>(null);

  const handleMenuSelect = ({ key }: { key: React.Key }) => {
    const selectedItem = items.find((item) => item.key === key);
    setSelectedComponent(selectedItem?.component || null);
  };

  return (
    <>
      <Layout
        style={{ minHeight: "90vh" }}
        className=" overflow-hidden h-[100%]"
      >
        <Sider
          className="  "
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          width={240}
          // style={{ background: "#f3f4f600" }}
        >
          <Menu
            // className="bg-gray-100"
            theme="light"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            defaultOpenKeys={["sub1", "sub2"]}
            onSelect={handleMenuSelect}
            // style={{ background: "#ECF3F9" }}
          />
        </Sider>
        <Layout>
          <Layout.Content style={{ padding: "16px" }}>
            {selectedComponent}
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Sidebar;
