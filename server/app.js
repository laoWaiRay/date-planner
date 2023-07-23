import express from "express";
import pg from "pg";
import cors from "cors";
import session from "express-session";
import userRouter from "./routes/users.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const app = express();
const PORT = 8000;
// const eventbrite_api = process.env.EVENTBRITE_API_KEY;
const ticketmaster_api = process.env.TICKETMASTER_API_KEY;

const pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: "dateplanner",
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: "5000kb"}));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true, // Security concern if set to false...
    },
  })
);

app.use("/users", userRouter);

app.get("/mydates", async (req, res) => {
  var category = req.query.category
  var price = req.query.price
  // var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments FROM events`;

  if ((category == "all" && price == "all") || (category === undefined && price === undefined)) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                      locations.city, locations.country, locations.detailed_address  
                      FROM events INNER JOIN locations ON events.location_id = locations.id;`
  } else if (category !== undefined && (price == "all" || price === undefined)) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE category='${category}';`
  } else if (price !== undefined && (category == "all" || category === undefined)) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE price='${price}';`
  } else if (category !== undefined && price !== undefined) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE category='${category}' AND price='${price}';`
  }

  await pool.query(myDatesQuery, (err, result) => {
    if (err) {
      res.end(err);
    }
    res.send(result.rows)
  });
});


// app.get("/eventbrite", (req, res) => {
//   let url = `https://www.eventbriteapi.com/v3/venues/1234/?token=XVEX5DQROS3XG6RL36W5`;
//   fetch(url)
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((error) => {
//       res.end(error);
//     });
// });

app.post("/mydates", async (req, res) => {
  try {
    const { date } = req.body;
    //Insert location table first
    const locationQuery = `INSERT INTO locations (city, country, detailed_address) VALUES ($1, $2, $3) RETURNING id`;
    const locationValues = [date.city, date.country, date.location];
    const locationResult = await pool.query(locationQuery, locationValues);
    const locationId = locationResult.rows[0]?.id;

    //to be done insert into user, and get id ? or you have user id just insert it
    //for mock data im making user 1

    //Insert into events table
    const eventQuery = `INSERT INTO events (title, description, author, price, category, preferred_time, location_id, private, comments, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const eventValues = [
      date.title,
      date.date_idea,
      date.author,
      date.price_range,
      date.category,
      date.preferred_time,
      locationId,
      date.isPrivate,
      date.comments,
      date.image
    ];
    const response = await pool.query(eventQuery, eventValues);

    if (response.error) {
      let error_message = {
        error: "Cannot insert into ingredient model",
      };
      res.status(500).json(error_message);
    } else {
      res.status(200).end();
    }
     
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/ticketmaster", (req, res) => {
  let startTime = "2023-07-09T01:00:00Z";
  let endTime = "2023-07-14T23:59:00Z";
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&countryCode=CA&city=Vancouver&apikey=${ticketmaster_api}`;
  // let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&countryCode=CA&city=Vancouver&startDateTime=${startTime}&endDateTime=${endTime}&apikey=${ticketmaster_api}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data?._embedded?.events);
    })
    .catch((error) => {
      res.send(error);
    });
});

// Get ticketmaster event by id
app.get("/ticketmaster/:id", async (req, res, next) => {
  const { id } = req.params;
  const result = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?id=${id}&apikey=${ticketmaster_api}`);
  const data = await result.json();
  res.json(data?._embedded?.events?.[0]);
})

// Get user-created event by id
app.get("/events/:id", async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(`SELECT * FROM events WHERE id = ${id}`);
  const data = result.rows[0];
  res.json(data);
})

// Get location by id
app.get("/locations/:id", async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(`SELECT * FROM locations WHERE id = ${id}`);
  const data = result.rows[0];
  console.log("DEBUG", data)
  res.json(data);
})

app.post("/createInvite", async (req, res) =>{
  //URL parmaters
  const sender_id = req.query.sender_id;
  const receiver_id = req.query.receiver_id;
  const event_id = req.query.event_id;
  const status = req.query.status;
  const date = req.query.date;
  const start_time = req.query.start_time;  

  // Define INSERT query
  const insertQuery = `
    INSERT INTO invitations (sender_id, receiver_id, event_id, status, date, start_time)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;`;

// Defining parameter values for the INSERT query
  const values = [sender_id, receiver_id, event_id, status, date, start_time];
  try {
    const result = await pool.query(insertQuery, values);
    res.status(200).end();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Cannot insert into invitation model" });
  }

});

app.post("/updateInviteStatus", async (req, res) =>{
  //URL parmaters
  const invite_id = req.query.invite_id;
  const newStatus = req.query.status;

  // Define INSERT query
  const updateQuery = `
    UPDATE invitations
    SET status = $1
    WHERE id = $2;
  `;
  const values = [newStatus, invite_id];

  try {
    const result = await pool.query(updateQuery, values);
    res.status(200).end();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Cannot update invitation" });
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
