import React, { useMemo } from "react";
import {
  WrapperContainer,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperStatus,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperLeft,
  WrapperStyleHeader,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService.js";
import { useQuery } from "@tanstack/react-query";

const MyOrder = () => {
  const user = useSelector((state) => state.user);

  const fetchMyOrder = async () => {
    if (user?.id && user?.access_token) {
      const res = await OrderService.getOrderbyUserId(
        user?.id,
        user?.access_token
      );
      return res;
    }
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
  });

  const { data } = queryOrder;

  // Aggregate all games from all orders
  const allPurchasedGames = useMemo(() => {
    if (!data?.data) return [];

    const games = [];
    const orders = Array.isArray(data.data) ? data.data : [data.data];

    orders.forEach((order) => {
      if (order?.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          games.push({
            ...item,
            orderId: order._id,
            orderDate: order.createdAt || order.orderDate,
            isPaid: order.isPaid,
            paymentMethod: order.paymentMethod,
          });
        });
      }
    });

    return games;
  }, [data]);

  // Calculate total spent
  const totalSpent = useMemo(() => {
    return allPurchasedGames.reduce((sum, game) => sum + (game.totalPrice || 0), 0);
  }, [allPurchasedGames]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div style={{ with: "100%", minHeight: "100vh", paddingBottom: "50px" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h2
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "bold",
            fontSize: "42px",
            textShadow: "0 4px 8px rgba(102, 126, 234, 0.3)",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          🛍️ My Purchased Games
        </h2>

        {/* Summary Stats */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "20px 30px",
              borderRadius: "12px",
              color: "white",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "14px", opacity: 0.9 }}>Total Games</div>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {allPurchasedGames.length}
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              padding: "20px 30px",
              borderRadius: "12px",
              color: "white",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "14px", opacity: 0.9 }}>Total Spent</div>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {totalSpent.toLocaleString()} đ
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader
              style={{
                background: "#483D8B",
                fontSize: "20px",
                color: "#FFF",
                fontFamily: "Helvetica",
                padding: "15px 20px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "300px 120px 100px 120px 150px",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#FFFF00",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Game Name
                </span>
                <span
                  style={{
                    color: "#FFFF00",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Price
                </span>
                <span
                  style={{
                    color: "#FFFF00",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Discount
                </span>
                <span
                  style={{
                    color: "#FFFF00",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    color: "#FFFF00",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Purchase Date
                </span>
              </div>
            </WrapperStyleHeader>

            <WrapperListOrder>
              {allPurchasedGames && allPurchasedGames.length > 0 ? (
                allPurchasedGames.map((game, index) => {
                  return (
                    <WrapperItemOrder key={index}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "300px 120px 100px 120px 150px",
                          gap: "20px",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        {/* Game Name with Image */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <img
                            src={game?.image}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                            alt="game"
                          />
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "16px",
                              color: "#4B0082",
                              fontWeight: "500",
                            }}
                          >
                            {game?.name}
                          </div>
                        </div>

                        {/* Price */}
                        <span style={{ fontSize: "16px", color: "#4B0082" }}>
                          {game?.price?.toLocaleString()} đ
                        </span>

                        {/* Discount */}
                        <span
                          style={{
                            fontSize: "16px",
                            color: game?.discount > 0 ? "#e74c3c" : "#4B0082",
                            fontWeight: game?.discount > 0 ? "bold" : "normal",
                          }}
                        >
                          {game?.discount || 0}%
                        </span>

                        {/* Total Price */}
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#4B0082",
                            fontWeight: "bold",
                          }}
                        >
                          {game?.totalPrice?.toLocaleString()} đ
                        </span>

                        {/* Purchase Date */}
                        <div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#4B0082",
                            }}
                          >
                            {formatDate(game?.orderDate)}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: game?.isPaid ? "#27ae60" : "#e74c3c",
                              fontWeight: "500",
                              marginTop: "2px",
                            }}
                          >
                            {game?.isPaid ? "✓ Paid" : "✗ Unpaid"}
                          </div>
                        </div>
                      </div>
                    </WrapperItemOrder>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "18px",
                  }}
                >
                  <p style={{ fontSize: "24px", marginBottom: "10px" }}>📦</p>
                  <p>You don't have any purchased games yet</p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#ccc",
                      marginTop: "10px",
                    }}
                  >
                    Start shopping to see your games here!
                  </p>
                </div>
              )}
            </WrapperListOrder>

            {allPurchasedGames.length > 0 && (
              <WrapperStyleHeader
                style={{
                  background: "#483D8B",
                  fontSize: "20px",
                  color: "#FFF",
                  fontFamily: "Helvetica",
                  padding: "15px 20px",
                }}
              >
                <span
                  style={{
                    color: "#FFFF00",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Total Spent: {totalSpent.toLocaleString()} đ ({allPurchasedGames.length} games)
                </span>
              </WrapperStyleHeader>
            )}
          </WrapperLeft>
        </div>
      </div>
    </div>
  );
};
export default MyOrder;

