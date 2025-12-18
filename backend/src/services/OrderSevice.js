const Order = require("../models/OrderGame");
const User = require("../models/UserModel");
const mailService = require("./mail.service");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      totalPrice,
      user,
      isPaid,
      paidAt,
      orderDate,
    } = newOrder;
    console.log("newOrder", newOrder);
    try {
      const createOrder = await Order.create({
        orderItems,
        paymentMethod,
        totalPrice,
        user,
        isPaid,
        paidAt,
        orderDate,
      });
      if (createOrder) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createOrder,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({ user: id });
      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      console.log("e", e);
      reject(e);
    }
  });
};
const getAllOrder = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();
      const userPromises = allOrder.map(async (order) => {
        if (order?.user) {
          const user = await User.findOne({ _id: order?.user });
          return {
            ...order.toObject(), // Convert Mongoose document to plain JavaScript object
            userName: user?.userName,
            phone: user?.phone,
            email: user?.email,
          };
        }
        return order;
      });

      const ordersWithUserDetails = await Promise.all(userPromises);

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: ordersWithUserDetails,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const handleCheckoutSuccess = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm order và populate thông tin user và game details
      const order = await Order.findById(orderId)
        .populate('user')
        .populate('orderItems.game');

      if (!order) {
        reject(new Error("Order not found"));
        return;
      }

      if (!order.user) {
        reject(new Error("User not found for this order"));
        return;
      }

      // Lấy download URLs từ các games trong order
      const downloadLinks = order.orderItems.map(item => ({
        gameName: item.name,
        downloadUrl: item.game?.downloadUrl || "https://drive.google.com/file/d/YOUR_FILE_ID/view"
      }));

      // Lấy link của game đầu tiên để redirect (hoặc có thể tạo trang tổng hợp)
      const primaryDownloadUrl = downloadLinks[0]?.downloadUrl || "https://drive.google.com/file/d/YOUR_FILE_ID/view";

      // Gửi email xác nhận với tất cả download links
      try {
        await mailService.sendPurchaseConfirmationEmail(
          order.user.email,
          order,
          downloadLinks
        );
        console.log(`✅ Email sent to ${order.user.email}`);
      } catch (emailError) {
        console.error("❌ Failed to send email:", emailError);
        // Không reject, vẫn trả về download URL ngay cả khi email fail
      }

      // Cập nhật trạng thái order
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();

      resolve({
        status: "OK",
        message: "Checkout successful",
        success: true,
        downloadUrl: primaryDownloadUrl,
        downloadLinks: downloadLinks, // Trả về tất cả links
        data: {
          orderId: order._id,
          email: order.user.email,
          totalPrice: order.totalPrice
        }
      });
    } catch (e) {
      console.error("Error in handleCheckoutSuccess service:", e);
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getDetailsOrder,
  getAllOrder,
  handleCheckoutSuccess,
};
