import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Standard configuration for Gmail
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Your EcoLife Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #10B981; text-align: center;">Welcome to EcoLife! 🌍</h2>
        <p style="color: #334155; font-size: 16px;">Thank you for registering. To complete your setup and start completing challenges, please verify your email address using the code below:</p>
        
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${otp}</span>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
        <p style="color: #64748b; font-size: 14px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    // Only send if credentials are provided, otherwise just mock it for dev
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("SMTP credentials not provided. Mocking email send:");
      console.log(`To: ${email} | OTP: ${otp}`);
    }
  } catch (error) {
    console.error('Error sending OTP email:', error);
    // @ts-ignore
    throw new Error(`Failed to send verification email: ${error.message || error}`);
  }
};
