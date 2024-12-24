export const meetingScheduleHTMLTemplate = ({
  date,
  Time,
  employeeName,
  messageBody,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meeting Invitation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
                max-width: 600px;
                margin: auto;
            }
            h1 {
                color: #333;
                font-size: 24px;
                margin-bottom: 10px;
            }
            p {
                color: #555;
                line-height: 1.6;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
            .button {
                display: inline-block;
                padding: 10px 15px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Meeting Invitation</h1>
            <p>Dear ${employeeName},</p>
            <p>You are invited to a meeting scheduled as follows:</p>
            <p><strong>Date and Time:</strong> ${date}, ${Time}</p>
            <p><strong>Message from Admin:</strong></p>
            <p>${messageBody}</p>
            <p>We look forward to your participation.</p>
            <a href="#" class="button">Join Meeting</a>
            <div class="footer">
                <p>Best Regards,</p>
                <p>MCC</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
