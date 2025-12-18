const nodemailer = require('nodemailer');

// Cấu hình transporter với Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Gmail address
            pass: process.env.EMAIL_PASSWORD // Gmail App Password
        }
    });
};

// Gửi email xác nhận mua game
const sendPurchaseConfirmationEmail = async (userEmail, orderDetails, downloadLinks) => {
    try {
        const transporter = createTransporter();

        // Tạo danh sách games từ orderItems với download buttons
        const gamesList = orderDetails.orderItems
            .map((item, index) => {
                const downloadUrl = downloadLinks[index]?.downloadUrl || "https://drive.google.com/file/d/YOUR_FILE_ID/view";
                return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.totalPrice.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            <a href="${downloadUrl}" style="display: inline-block; padding: 8px 16px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">📥 Tải</a>
          </td>
        </tr>
      `;
            })
            .join('');

        const mailOptions = {
            from: `"GameCommerce" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '🎮 Xác nhận mua game thành công - GameCommerce',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 Cảm ơn bạn đã mua game!</h1>
            </div>
            <div class="content">
              <h2>Đơn hàng #${orderDetails._id}</h2>
              <p>Chào bạn,</p>
              <p>Cảm ơn bạn đã mua game tại <strong>GameCommerce</strong>! Đơn hàng của bạn đã được thanh toán thành công.</p>
              
              <h3>Chi tiết đơn hàng:</h3>
              <table class="order-table">
                <thead>
                  <tr style="background: #667eea; color: white;">
                    <th style="padding: 10px; text-align: left;">Hình ảnh</th>
                    <th style="padding: 10px; text-align: left;">Tên game</th>
                    <th style="padding: 10px; text-align: right;">Giá</th>
                    <th style="padding: 10px; text-align: center;">Tải xuống</th>
                  </tr>
                </thead>
                <tbody>
                  ${gamesList}
                </tbody>
                <tfoot>
                  <tr style="background: #f0f0f0; font-weight: bold;">
                    <td colspan="3" style="padding: 15px; text-align: right;">Tổng cộng:</td>
                    <td style="padding: 15px; text-align: right; color: #667eea; font-size: 18px;">$${orderDetails.totalPrice.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⚠️ Lưu ý:</strong></p>
                <ul style="margin: 10px 0;">
                  <li>Link tải game có hiệu lực vĩnh viễn</li>
                  <li>Nhấn vào nút "📥 Tải" bên cạnh mỗi game để tải xuống</li>
                  <li>Vui lòng kiểm tra thư mục spam nếu không thấy email</li>
                  <li>Liên hệ support nếu gặp vấn đề khi tải</li>
                </ul>
              </div>

              <p>Chúc bạn có trải nghiệm chơi game vui vẻ! 🎮</p>
              <p>Trân trọng,<br><strong>GameCommerce Team</strong></p>
            </div>
            <div class="footer">
              <p>Email này được gửi tự động, vui lòng không reply.</p>
              <p>&copy; 2024 GameCommerce. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendPurchaseConfirmationEmail
};
