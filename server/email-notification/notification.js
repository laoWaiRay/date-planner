import cron from "node-cron";
import mailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import dotenv from 'dotenv'
dotenv.config()

//T0 Get the Current Year, Month And Day
var dateYear = new Date().getFullYear();
var dateMonth = new Date().getMonth(); // start counting from 0
var dateDay = new Date().getDate();// start counting from 1

async function getUpcomingDates(){
    let results = [];

    try{
        results = await fetch("http://localhost:8000/allUpcomingEvents");

    } catch(error){
        console.log(error + ": Problem fetching all upcoming dates");
    }

    return await results.json();
}

function sendEmail(sender_email, receiver_username){
    const mailOptions = {
        from: 'dateplanner@zohomail.com',
        to: sender_email,
        subject: `Event Reminder `,
        html: `Upcoming Date today with ${receiver_username}. Please check out Dateplanner for more details.`                       
    };
    return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            console.log(error)
            return
        }
    });
}

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
//Cron Job to run at 6am Server Time 
cron.schedule('0 6 * * *', async () => {
    const inviteData = await getUpcomingDates();
    ///The Main Function 
    const sendReminder =  
    // looping through the users
    inviteData.forEach(element => {
        sendEmail(element.sender_email, element.receiver_username);
        sendEmail(element.receiver_email, element.sender_username);
    });
});