export const config = {
    otpTemplate: (otp: number) => `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          .header {
              background:rgb(31, 33, 128);
              color: #ffffff;
              padding: 15px;
              font-size: 24px;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
          }
          .otp {
              font-size: 24px;
              font-weight: bold;
              color:rgb(42, 33, 144);
              margin: 20px 0;
              padding: 12px 24px;
              background: #f1f1f1;
              border-radius: 6px;
              display: inline-block;
          }
          .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to Article Feeds!</div>
          <p>Thank you for registering with Article Feeds.</p>
          <p>To complete your registration, please verify your email using the OTP below:</p>
          <div class="otp">${otp}</div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you did not register, please ignore this email.</p>
          <div class="footer">&copy; 2025 Article Feeds. All rights reserved.</div>
      </div>
  </body>
  </html>`
  };
  