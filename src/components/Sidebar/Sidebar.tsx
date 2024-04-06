import React, { useState } from "react";

import { UserOutlined, BookOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number] & {
  component?: React.ReactNode;
};

// const currentRole = localStorage.getItem("userRole");

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
  getItem("Manage", "sub1", <SettingOutlined />, [
    getItem("Author Setup", "3", undefined, undefined, "author-setup"),
    getItem("Category Setup", "4", undefined, undefined, "category-setup"),
    getItem("Member Setup", "5", undefined, undefined, "member-setup"),
    getItem("Book Setup", "6", undefined, undefined, "book-setup"),
  ]),
  getItem("Transaction", "sub2", <BookOutlined />, [
    getItem("Rent/Return", "7", undefined, undefined, "rent-book"),
    getItem("Return History", "8", undefined, undefined, "return-book"),
    getItem("Manage Users", "9", <UserOutlined />, undefined, "manage-users"),
  ]),
];

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
      <Layout style={{ minHeight: "90vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
        >
          <Menu
            theme="light"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            defaultOpenKeys={["sub1", "sub2"]}
            onSelect={handleMenuSelect}
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
