import React from "react";
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
  console.log("data", data);

  return (
    <div style={{ with: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h2 style={{
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
          gap: "10px"
        }}>
          🛍️ My Order
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader
              style={{
                background: "#483D8B",
                fontSize: "30px",
                color: "#FFF",
                fontFamily: "Helvetica",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "545px",
                }}
              >
                <span
                  style={{
                    color: "#FFFF00",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Name
                </span>
                <span
                  style={{
                    color: "#FFFF00",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Price
                </span>
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {data?.data?.orderItems && data?.data?.orderItems?.length > 0 ? (
                data?.data?.orderItems?.map((order, index) => {
                  return (
                    <WrapperItemOrder key={index}>
                      <div
                        style={{
                          width: "600px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <img
                          src={order?.image}
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                          alt="game"
                        />

                        <div
                          style={{
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "18px",
                            color: "#4B0082",
                          }}
                        >
                          {order?.name}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          <span style={{ fontSize: "18px", color: "#4B0082" }}>
                            ${order?.totalPrice}
                          </span>
                        </span>
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
                  <p>You don't have any orders yet</p>
                  <p style={{ fontSize: "14px", color: "#ccc", marginTop: "10px" }}>
                    Start shopping to see your orders here!
                  </p>
                </div>
              )}
            </WrapperListOrder>
            {data?.data?.totalPrice && (
              <WrapperStyleHeader
                style={{
                  background: "#483D8B",
                  fontSize: "30px",
                  color: "#FFF",
                  fontFamily: "Helvetica",
                }}
              >
                <span style={{ display: "inline-block", width: "390px" }}>
                  <span
                    style={{
                      color: "#FFFF00",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    Total Price: ${data?.data?.totalPrice}
                  </span>
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
