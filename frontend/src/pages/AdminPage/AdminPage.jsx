import React, { useState } from "react";
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminGame from "../../components/AdminGame/AdminGame";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import {
  AdminContainer,
  MenuWrapper,
  MenuHeader,
  MenuItem,
  ContentWrapper,
} from "./style";

const AdminPage = () => {
  const [keySelected, setKeySelected] = useState("games");

  const menuItems = [
    { key: "games", icon: <AppstoreOutlined />, label: "Games" },
    { key: "users", icon: <UserOutlined />, label: "Users" },
    { key: "orders", icon: <ShoppingOutlined />, label: "Orders" },
  ];

  const renderPage = (key) => {
    switch (key) {
      case "users":
        return <AdminUser />;
      case "games":
        return <AdminGame />;
      case "orders":
        return <AdminOrder />;
      default:
        return <></>;
    }
  };

  const handleMenuClick = (key) => {
    setKeySelected(key);
  };

  return (
    <>
      <HeaderComponent isHiddenCart isHiddenSearch isZoom />

      <AdminContainer>
        <MenuWrapper>
          <MenuHeader>
            <h2>Admin Panel</h2>
            <p>Management System</p>
          </MenuHeader>

          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              active={keySelected === item.key}
              onClick={() => handleMenuClick(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </MenuItem>
          ))}
        </MenuWrapper>

        <ContentWrapper>{renderPage(keySelected)}</ContentWrapper>
      </AdminContainer>
    </>
  );
};

export default AdminPage;
