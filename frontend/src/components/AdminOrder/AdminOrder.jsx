import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  WrapperHeader,
  StatsContainer,
  StatsCard,
  DashboardRow,
  ChartContainer,
  BestSellersContainer,
  BestSellerItem,
} from "./style";
import { Button } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService.js";
import { useQuery } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);

  const getAllOrders = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrders = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const { data: orders } = queryOrders;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!orders?.data) return null;

    const totalOrders = orders.data.length;
    const totalRevenue = orders.data.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );
    const paidOrders = orders.data.filter((order) => order.isPaid).length;
    const unpaidOrders = totalOrders - paidOrders;

    return {
      totalOrders,
      totalRevenue,
      paidOrders,
      unpaidOrders,
    };
  }, [orders]);

  // Calculate best-selling games
  const bestSellingGames = useMemo(() => {
    if (!orders?.data) return [];

    const gameStats = {};

    orders.data.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          const gameName = item.name;
          if (!gameStats[gameName]) {
            gameStats[gameName] = {
              name: gameName,
              quantity: 0,
              revenue: 0,
            };
          }
          gameStats[gameName].quantity += 1;
          gameStats[gameName].revenue += item.totalPrice || item.price || 0;
        });
      }
    });

    return Object.values(gameStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  // Calculate daily revenue
  const dailyRevenue = useMemo(() => {
    if (!orders?.data) return [];

    const revenueByDate = {};

    orders.data.forEach((order) => {
      // Use createdAt or orderDate
      const date = new Date(order.createdAt || order.orderDate);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

      if (!revenueByDate[dateKey]) {
        revenueByDate[dateKey] = 0;
      }
      revenueByDate[dateKey] += order.totalPrice || 0;
    });

    // Convert to array and sort by date
    return Object.entries(revenueByDate)
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString("vi-VN", {
          month: "short",
          day: "numeric",
        }),
        revenue: Math.round(revenue),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14); // Last 14 days
  }, [orders]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />

        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters)}
          size="small"
          style={{
            width: 90,
          }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "UserName",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email - b.email,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Paided",
      dataIndex: "paided",
      sorter: (a, b) => a.paided - b.paided,
      ...getColumnSearchProps("paided"),
    },
    {
      title: "Total price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      ...getColumnSearchProps("price"),
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        paided: order.isPaid ? "TRUE" : "FALSE",
        price: order?.totalPrice,
        userName: order.userName,
        phone: order.phone,
        email: order.email,
        key: order._id,
      };
    });

  const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#667eea", "#764ba2"];

  return (
    <div style={{ marginTop: "10px" }}>
      <WrapperHeader>Manager Orders</WrapperHeader>

      {/* Statistics Cards */}
      {statistics && (
        <StatsContainer>
          <StatsCard gradient="#667eea 0%, #764ba2 100%">
            <h3>Total Orders</h3>
            <p>{statistics.totalOrders}</p>
          </StatsCard>
          <StatsCard gradient="#f093fb 0%, #f5576c 100%">
            <h3>Total Revenue</h3>
            <p>{statistics.totalRevenue.toLocaleString()} đ</p>
          </StatsCard>
          <StatsCard gradient="#4facfe 0%, #00f2fe 100%">
            <h3>Paid Orders</h3>
            <p>{statistics.paidOrders}</p>
          </StatsCard>
          <StatsCard gradient="#fa709a 0%, #fee140 100%">
            <h3>Unpaid Orders</h3>
            <p>{statistics.unpaidOrders}</p>
          </StatsCard>
        </StatsContainer>
      )}

      {/* Dashboard Row: Best Sellers + Chart */}
      <DashboardRow>
        {/* Best Selling Games */}
        <BestSellersContainer>
          <h2>🏆 Top 5 Best-Selling Games</h2>
          {bestSellingGames.length > 0 ? (
            bestSellingGames.map((game, index) => (
              <BestSellerItem key={index} color={rankColors[index]}>
                <div className="rank">#{index + 1}</div>
                <div className="info">
                  <div className="name">{game.name}</div>
                  <div className="stats">Sold: {game.quantity} copies</div>
                </div>
                <div className="revenue">{game.revenue.toLocaleString()} đ</div>
              </BestSellerItem>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              No sales data available
            </p>
          )}
        </BestSellersContainer>

        {/* Daily Revenue Chart */}
        <ChartContainer>
          <h2>📈 Daily Revenue (Last 14 Days)</h2>
          {dailyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString()} đ`}
                  labelStyle={{ color: "#333" }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#667eea" name="Revenue (đ)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              No revenue data available
            </p>
          )}
        </ChartContainer>
      </DashboardRow>

      {/* Orders Table */}
      <div style={{ marginTop: "20px" }}>
        <TableComponent columns={columns} data={dataTable} />
      </div>
    </div>
  );
};

export default AdminOrder;
