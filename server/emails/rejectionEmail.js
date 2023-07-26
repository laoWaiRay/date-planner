import mailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

//// credentials for your Mail
const transporter = mailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, //ssl
    auth: {
        user: 'dateplanner@zohomail.com',
        pass: 'd%#Gv@g@5Lh@X-3'
    }
});
    ///The Main Function 
export function sendRejectionMail(email, name, date){
    console.log("working!")
    const mailOptions = {
        from: 'dateplanner@zohomail.com',
        to: email,
        subject: `Event Rejected`,
        html: `Your event with ${name} on the date ${date} has been rejected`                       
    };
    return transporter.sendMail(mailOptions, (error, data) => {
        console.log("sent rejection letter")
        if (error) {
            console.log(error)
            return
        }
    });
}