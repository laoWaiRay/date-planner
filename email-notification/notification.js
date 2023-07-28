import cron from "node-cron";
import mailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

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

//// credentials for your Mail
const transporter = mailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, //ssl
    auth: {
      user: "dateplanner@zohomail.com",
      pass: "d%#Gv@g@5Lh@X-3"
    }
  });
//Cron Job to run around 7am Server Time 
cron.schedule('30 11 * * *', async () => {
    console.log("cron-job running");
    const inviteData = await getUpcomingDates();
    console.log(inviteData);
    ///The Main Function 
    const sendReminder =  
    // looping through the users
    inviteData.forEach(element => {
        const mailOptions = {
            from: 'dateplanner@zohomail.com',
            to: element.sender_email,
            subject: `Event Reminder `,
            html: `Upcoming Date today with ${element.receiver_username}. Please check out Dateplanner for more details.`                       
        };
        return transporter.sendMail(mailOptions, (error, data) => {
            console.log("sent!")
            if (error) {
                console.log(error)
                return
            }
        });
    });
});