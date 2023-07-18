import cron from "node-cron";
import mailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

//T0 Get the Current Year, Month And Day
var dateYear = new Date().getFullYear();
var dateMonth = new Date().getMonth(); // start counting from 0
var dateDay = new Date().getDate();// start counting from 1

/* The Schema Which The Database Follow 
    {
        'id' : number,
        'name' : string,
        'dob' : string (day - month),
        'email' : string 
    },
 * You can Use Any type of schema (This is the method I preferred)
*/

/// database goes here 
var users = [
    {
        'id' : '000',
        'name' : 'user1',
        'dob' : '14-6-1994',
        'email' : 'jaiveerdhanju@hotmail.com'
    },
    {
        'id' : '001',
        'name' : 'user2',
        'dob' : '14-6-2003',
        'email' : 'lcchow@sfu.ca'
    },
    {
        'id' : '002',
        'name' : 'user3',
        'dob' : '17-4-2004',
        'email' : 'user3@exapmle.com'
    },
    {
        'id' : '003',
        'name' : 'user4',
        'dob' : '6-0-1999',
        'email' : 'user4@exapmle.com'
    }
]

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
//Cron Job to run around 7am Server Time 
cron.schedule('31 14 * * *', () => {
    ///The Main Function 
    const sendWishes =  
    // looping through the users
    users.forEach(element => {
        // Spliting the Date of Birth (DOB) 
        // to get the Month And Day
        let d = element.dob.split('-')
        let dM = +d[1]  // For the month
        let dD = +d[0] // for the day 
        let age = dateYear - +d[2]
        console.log( typeof dM) //return number
        // Sending the Mail
        console.log(dateDay)
        console.log(dD)
        console.log(dateMonth)
        console.log(dM)
        if(dateDay == dD && dateMonth == dM ){
            console.log("working!")
            const mailOptions = {
                from: 'dateplanner@zohomail.com',
                to: element.email,
                subject: `Happy Birthday `,
                html: `Wishing You a <b>Happy birthday ${element.name}</b> On Your ${age}, Enjoy your day \n <small>this is auto generated</small>`                       
            };
            return transporter.sendMail(mailOptions, (error, data) => {
                console.log("sent!")
                if (error) {
                    console.log(error)
                    return
                }
            });
        } 
    });
});