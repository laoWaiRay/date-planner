import mailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

//// credentials for your Mail
const transporter = mailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, //ssl
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASS
    }
});
    ///The Main Function 
export function sendAcceptanceMail(email, name, date){
    const mailOptions = {
        from: process.env.ZOHO_EMAIL,
        to: email,
        subject: `Event Accepted`,
        html: `Your event with ${name} on the date ${date} has been accepted`                       
    };
    return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            console.log(error)
            return
        }
    });
}