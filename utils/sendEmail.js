const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
    try {
        const htmlContent = `
  
        <h3>Hello User </h3> <br>

        <p>${message}</p>

        <p>Sincerely,</p>
        <p>BricksFi.</p>
        
    `;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: htmlContent,
        });
    } catch (err) {
        console.error('Error sending email:', err.message);
    }
};


module.exports = sendEmail;
