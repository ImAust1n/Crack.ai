import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Route to send email
router.post('/send', async (req, res) => {
    try {
        const { userId, email } = req.body;

        if (!userId || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId or email'
            });
        }

        // Email options
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Streak Loss Alert",
            message: "",
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                      <h2 style="color: #d9534f;">Streak Loss Alert</h2>
                      <p>Hi ${userId},</p>
                      <p>It looks like you're going a day of logging your habits. Don't let your streak come to an end!</p>
                      <p><a href="https://locked.in/dashboard" style="color: #00b8d9; text-decoration: underline;">Head to the dashboard</a> to update your habits and keep your streak going.</p>
                      <p>Best, <br>The Locked.in Team</p>
                      <p style="margin-top: 20px; font-size: 12px; color: #777;">
                        This is an automated message from the Locked.in Management System.
                      </p>
                    </div>`,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

export default router;