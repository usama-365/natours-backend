const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, message }) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Send email
    await transporter.sendMail({
        from: 'Natours <hello@natours.io>',
        to,
        subject,
        text: message
    });
};

module.exports = sendEmail;