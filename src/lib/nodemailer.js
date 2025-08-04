import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or use "smtp.mailtrap.io" / your SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your Verification Code",
    text: `Your verification code is: ${otp}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; font-size: 24px; font-weight: 500; margin: 0;">Email Verification</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 24px;">
          <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Use this code to verify your email address:</p>
          <div style="letter-spacing: 8px; font-size: 32px; font-weight: 700; color: #333; margin: 12px 0;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">This code will expire in 5 minutes</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 13px;">
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
