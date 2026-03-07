const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
   }
});

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} token - Reset token
 */
const sendResetPasswordEmail = async (email, token) => {
   const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

   const mailOptions = {
      from: `"TrekMate Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'TrekMate - Password Reset Request',
      html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10b981; text-align: center;">TrekMate</h2>
            <p>You requested a password reset for your TrekMate account.</p>
            <p>Please click the button below to reset your password. This link is valid for 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
               <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p>If you did not request this, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">© 2024 TrekMate. All rights reserved.</p>
         </div>
      `
   };

   return transporter.sendMail(mailOptions);
};

module.exports = {
   sendResetPasswordEmail
};
