import nodemailer from 'nodemailer';
import { isValidEmail } from '../utils/utils';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { env } from '../utils/env';

export default class Mail {
    readonly recipientEmail: string;
    private readonly transporter: nodemailer.Transporter<SentMessageInfo>;

    constructor(recipientEmail: string){
        if(!isValidEmail(recipientEmail)) throw new Error("Invalid recipient email address");
        this.recipientEmail = recipientEmail;


        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bricksfireg@gmail.com',   
                pass: String(env.MAIL_APP_PASSWORD)
            }
        });
    }

    async sendRegisterCode(code: number) {
        let mailOptions = {
            from: '"BricksFi" swepproject@gmail.com',
            to: this.recipientEmail,            
            subject: `Registration code`,
            //text: '',                      
            html: `<p>Use this code to complete your account's verification.</p><p><b>Code: ${code}</b></p><p>The code will expire in 1 hour.</p>`
        };

        this.send(mailOptions);
    }



    async send(mailOptions) {
        try {
            let info = await this.transporter.sendMail(mailOptions);
            //console.log('Message sent: %s', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
