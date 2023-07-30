import express from "express";
import pg from "pg";
import cors from "cors";
import session from "express-session";
import userRouter from "./routes/users.js";
import reviewRouter from "./routes/reviews.js"
import dotenv from "dotenv";
import fetch from "node-fetch";
import { sendRejectionMail } from "./emails/rejectionEmail.js";
import { sendAcceptanceMail } from "./emails/acceptanceEmail.js";
dotenv.config();

const app = express();
const PORT = 8000;
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
app.use("/reviews", reviewRouter);

app.get("/mydates", async (req, res) => {
  var userid = req.query.user
  var category = req.query.category
  var price = req.query.price

  // var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments FROM events`;

  if ((category == "all" && price == "all") || (category === undefined && price === undefined)) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                      locations.city, locations.country, locations.detailed_address  
                      FROM events INNER JOIN locations ON events.location_id = locations.id
                      WHERE author=$1 AND isticketmasterevent = 'f';`
    var values = [userid]
  } else if (category !== undefined && (price == "all" || price === undefined)) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE category=$1 AND author=$2 AND isticketmasterevent = 'f';`
    var values = [category, userid]
  } else if (price !== undefined && (category == "all" || category === undefined)) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE price=$1 AND author=$2 AND isticketmasterevent = 'f';`
    var values = [price, userid]
  } else if (category !== undefined && price !== undefined) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE category=$1 AND price=$2;`
    var values = [category, price]
  }

  await pool.query(myDatesQuery, values, (err, result) => {
    if (err) {
      res.end(err);
    }
    res.send(result.rows)
  });
});

app.get("/publicdates", async (req, res) => {
  var category = req.query.category
  var price = req.query.price
  var city = req.query.location
  var publicDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id 
                        WHERE private='f'`
  var values = []
  var count=1

  if (category !== undefined && category !== "all") {
    var publicDatesQuery = publicDatesQuery + ` AND category =$${count}`
    count++;
    values.push(category)
  } 
  
  if (price !== undefined && price !== "all") {
    var publicDatesQuery = publicDatesQuery + ` AND price =$${count}`
    count++;
    values.push(price)
  }

  if (city !== undefined && city !== "all") {
    var publicDatesQuery = publicDatesQuery + ` AND locations.city =$${count}`
    count++;
    values.push(city)
  }

  await pool.query(publicDatesQuery, values, (err, result) => {
    if (err) {
      res.end(err);
    }
    res.send(result.rows)
  });
});


app.get("/favorites", async (req, res) => {
  var userid = req.query.user

  var favoritesQuery = 
    `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
    locations.city, locations.country, locations.detailed_address  
    FROM events INNER JOIN locations ON events.location_id = locations.id
    WHERE events.id IN (SELECT event_id FROM saved WHERE user_id = ${userid});`

  await pool.query(favoritesQuery, (err, result) => {
    if (err) {
      res.end(err);
    }
    res.send(result.rows)
  });
});

app.post("/favorites", async (req, res) => {
  const userid = req.query.user
  const eventid = req.query.event

  // Add event to favorites table
  var checkFavQuery = `SELECT * FROM saved WHERE user_id=$1 AND event_id=$2`
  const favResult = await pool.query(checkFavQuery, [userid, eventid]);

  if (favResult.rows.length == 0) {
    var addFavoriteQuery = `INSERT INTO saved(user_id,event_id) VALUES(${userid},'${eventid}')`
    pool.query(addFavoriteQuery, (err, result) => {
      if (err) {
        console.log(err)
        res.end(err);
      }
      res.json(result)
    }) 
  }
});


app.delete("/favorites", async (req, res) => {
  var del_userid = req.query.user
  var del_eventid = req.query.event

  var delFavoriteQuery = `DELETE FROM saved WHERE user_id='${del_userid}' AND event_id='${del_eventid}'`

  pool.query(delFavoriteQuery, (err, result) => {
    if (err) {
      console.log(err)
      res.end(err);
    }
    res.json(result)
  });
});


app.post("/mydates", async (req, res) => {
  try {
    const { date } = req.body;

    // Check if location is already in DB before insert
    let locationId = null;
    const existsQuery = `SELECT * FROM locations WHERE city = $1 AND country = $2 AND detailed_address = $3`;
    let result = await pool.query(existsQuery, [date.city, date.country, date.location]);
    if (result.rows.length > 0) {
      locationId = result.rows[0].id;
    }

    if (!locationId) {
      //Insert location table first
      const locationQuery = `INSERT INTO locations (city, country, detailed_address) VALUES ($1, $2, $3) RETURNING id`;
      const locationValues = [date.city, date.country, date.location];
      const locationResult = await pool.query(locationQuery, locationValues);
      locationId = locationResult.rows[0]?.id;
    }

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

// PATCH: edit a date
app.patch("/mydates", async (req, res, next) => {
  try {
    const { date } = req.body;

    const { event_id, title, date_idea, location, city, country, price_range, category, 
      preferred_time, comments, image, isPrivate, author } = date;

    // Check if location is already in DB before insert
    let locationId = null;
    const existsQuery = `SELECT * FROM locations WHERE city = $1 AND country = $2 AND detailed_address = $3`;
    let result = await pool.query(existsQuery, [city, country, location]);
    if (result.rows.length > 0) {
      locationId = result.rows[0].id;
    }

    if (!locationId) {
      //Insert location table first
      const locationQuery = `INSERT INTO locations (city, country, detailed_address) VALUES ($1, $2, $3) RETURNING id`;
      const locationValues = [date.city, date.country, date.location];
      const locationResult = await pool.query(locationQuery, locationValues);
      locationId = locationResult.rows[0]?.id;
    }

    // This is a hacky way to only update the image if the user uploaded a new image

    const query = `
      UPDATE events 
      SET title = $1, description = $2, price = $3, category = $4, preferred_time = $5, 
          location_id = $6, date_posted = CURRENT_DATE, private = $7, comments = $8 ${image ? " ,image = $10 " : " "}
      WHERE id = $9;
    `;
    
    const queryValues = [
      title, 
      date_idea, 
      price_range, 
      category, 
      preferred_time, 
      locationId, 
      isPrivate, 
      comments, 
      event_id
    ];

    if (image)
      queryValues.push(image);

    await pool.query(query, queryValues);

    res.end();
  } catch (error) {
    console.error(error);
    res.end();
  }
})

app.get("/ticketmaster", (req, res) => {
  var start = req.query.start
  var end = req.query.end
  var countryCode = req.query.country
  var city = req.query.city

  const dateObj = new Date()
  var currDay = dateObj.getDate()
  if (currDay < 10) {
    currDay = "0"+currDay
  }

  var currMonth = dateObj.getMonth()+1
  if (currMonth < 10) {
    currMonth = "0"+currMonth
  }
  var currYear = dateObj.getFullYear()
  var currentDate = currYear+"-"+currMonth+"-"+currDay
  if (start === undefined || start == "") {
    var startTime = currentDate.toString()+"T00:00:00Z"
  } else {
    var startTime = start.toString()+"T00:00:00Z"
  }

  if (end === undefined || end == "") {
    var endTime = currentDate.toString()+"T23:59:00Z"
  } else {
    var endTime = end.toString()+"T23:59:00Z"
  }

  if (city === undefined || city === "") {
    var url = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=${countryCode}&startDateTime=${startTime}&endDateTime=${endTime}&apikey=${ticketmaster_api}`;
  } else {
    var url = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=${countryCode}&city=${city}&startDateTime=${startTime}&endDateTime=${endTime}&apikey=${ticketmaster_api}`;
  }

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const events = data?._embedded?.events;
      if (events && events.length > 0) 
        res.json(events);
      else 
        res.json([]);
    })
    .catch((error) => {
      res.send([])
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
  const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
  const data = result.rows[0];
  res.json(data);
})

// Delete an event by event id
app.delete("/events/:id", async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM events WHERE id = $1`, [id]);
  res.end();
})

// Get all locations
app.get("/locations", async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(`SELECT * FROM locations;`);
  const data = result.rows;
  res.json(data);
})

// Get location by id
app.get("/locations/:id", async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(`SELECT * FROM locations WHERE id = $1`, [id]);
  const data = result.rows[0];
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

  // If invitation is for ticketmaster event, it must be added to the events table first
  if (event_id.length > 10) {
    const result = await pool.query(`SELECT * FROM Events WHERE id = $1`, [event_id])
    if (result.rows.length == 0) {
      let result = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?id=${event_id}&apikey=${ticketmaster_api}`);
      let data = await result.json();
      const title = data._embedded?.events?.[0]?.name;

      // GET location and populate locations table
      const locationsRef = data._embedded?.events?.[0]?._links?.venues?.[0]?.href;
      result = await fetch (`https://app.ticketmaster.com/${locationsRef}&apikey=${ticketmaster_api}`)
      data = await result.json()
      const city = data?.city?.name;
      const country = data?.country?.name;
      const detailedAddress = data?.name;

      const locationQuery = `INSERT INTO locations (city, country, detailed_address) VALUES ($1, $2, $3) RETURNING id`;
      const locationValues = [city, country, detailedAddress];
      const locationResult = await pool.query(locationQuery, locationValues);
      const locationId = locationResult.rows[0]?.id;

      const query = `INSERT INTO Events (id, title, location_id, isticketmasterevent) VALUES ($1, $2, $3, $4)`
      await pool.query(query, [event_id, title, locationId, true])
    }
  }

  // Define INSERT query
  const insertQuery = `
    INSERT INTO invitations (sender_id, receiver_id, event_id, status, date, start_time)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;`;

// Defining parameter values for the INSERT query
  const values = [sender_id, receiver_id, event_id, status, date, start_time];
  try {
    await pool.query(insertQuery, values);
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

//fetch a users pending invites
app.get("/pendingUserInvites", async (req, res) =>{
  
  const user_id = req.query.user_id;

    // Define INSERT query
 const selectQuery = `
  SELECT 
    invitations.id AS invitation_id,
    users.username AS sender_username,
    users.avatar AS sender_avatar_url,
    invitations.start_time AS invitation_start_time,
    invitations.date AS invitation_date,
    events.id AS event_id,
    events.title AS event_title,
    locations.detailed_address AS event_detailed_address,
    locations.city AS event_city,
    locations.country AS event_country
  FROM invitations
  JOIN users ON invitations.sender_id = users.id
  JOIN events ON invitations.event_id = events.id
  JOIN locations ON events.location_id = locations.id
  WHERE invitations.receiver_id = $1 AND invitations.status = 'pending';
`;

// Defining parameter values for the INSERT query
  const values = [user_id];

  try {
    const result = await pool.query(selectQuery, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Cannot select users pending invitations" });
  }
})

//fetch upcoming users invites
app.get("/upcomingUserInvites", async (req, res) => {
  const user_id = req.query.user_id;
  const currentDate = new Date();

   const selectQuery = `
    SELECT 
      invitations.id AS invitation_id,
      users.username AS sender_username,
      receivers.username AS receiver_username,
      users.avatar AS sender_avatar_url,
      receivers.avatar AS receiver_avatar_url,
      invitations.start_time AS invitation_start_time,
      invitations.date AS invitation_date,
      events.id AS event_id,
      events.title AS event_title,
      locations.detailed_address AS event_detailed_address,
      locations.city AS event_city,
      locations.country AS event_country
    FROM invitations
    JOIN users ON invitations.sender_id = users.id
    JOIN users AS receivers ON invitations.receiver_id = receivers.id
    JOIN events ON invitations.event_id = events.id
    JOIN locations ON events.location_id = locations.id
    WHERE (invitations.receiver_id = $1 OR invitations.sender_id = $1)
      AND invitations.status = 'accepted'
      AND (invitations.date > $2 OR (invitations.date = $2 AND invitations.start_time > $3));
  `;

  const values = [user_id, currentDate.toISOString().slice(0, 10), currentDate.toISOString().slice(11, 19)];

  try {
    const result = await pool.query(selectQuery, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Cannot select user's upcoming invitations" });
  }
});

// Add a new review for a given event ID
app.post("/reviews/:id", async (req, res, next) => {
  const { id } = req.params;
  const { author_id, comment, score } = req.body;
  await pool.query(`
    INSERT INTO reviews(event_id, author_id, comment, score)
    VALUES ($1, $2, $3, $4);
  `, [id, author_id, comment, score]);
  res.status(200).end();
})

// Edit a review for a given review ID
app.post("/reviews/:id/edit", async (req, res, next) => {
  const { id } = req.params;
  const { comment, score } = req.body;
  await pool.query(`
    UPDATE reviews
    SET comment = $1, score = $2, date = CURRENT_DATE
    WHERE id = $3;
  `, [comment, score, id])
  res.status(200).end();
})

// Delete a review by review ID
app.delete("/reviews/:id", async (req, res, next) => {
  const { id } = req.params;
  const query = `
    DELETE FROM reviews
    WHERE id = $1;
  `;
  await pool.query(query, [id]);
  res.status(200).end();
})

// Get a list of all reviews for a given event ID
app.get("/reviews/:id", async (req, res, next) => {
  const { id } = req.params;
  const query = `
    SELECT R.id, U.username, R.score, R.comment, R.date 
    FROM reviews R
      INNER JOIN events E ON R.event_id = E.id
      INNER JOIN users U ON R.author_id = U.id
    WHERE E.id = ($1)
    ORDER BY R.date;
  `;
  const result = await pool.query(query, [id]);
  res.json(result.rows);
})

// Get the average rating for a given event ID
app.get("/reviews/:id/average", async (req, res, next) => {
  const { id } = req.params;
  const query = `
    SELECT AVG (score)
    FROM reviews
    WHERE event_id = $1
  `;
  const result = await pool.query(query, [id]);
  res.json(result.rows[0]);
})

app.get("/rejectionEmail", async (req, res) => {
  const invitation_id = req.query.invitation_id;

  const query = `
    SELECT 
    users_receiver.username AS receiver_username,
    users_sender.email AS sender_email,
    invitations.date
    FROM invitations
    JOIN users AS users_sender ON invitations.sender_id = users_sender.id
    JOIN users AS users_receiver ON invitations.receiver_id = users_receiver.id
    WHERE invitations.id = $1;
  `;

  const values = [invitation_id];

  try{
    const result = await pool.query(query, values);
    const senderInfo = {
      receiver_username: result.rows[0].receiver_username,
      sender_email: result.rows[0].sender_email,
      date: result.rows[0].date,
    };
    sendRejectionMail(senderInfo.sender_email, senderInfo.receiver_username, senderInfo.date);
    res.status(200);
    res.json("Email sent!")
  } catch(error){
    res.status(500).json({ error: "Cannot send rejection email" });
  }

})

app.get("/acceptanceEmail", async (req, res) => {
  const invitation_id = req.query.invitation_id;

  const query = `
    SELECT 
    users_receiver.username AS receiver_username,
    users_sender.email AS sender_email,
    invitations.date
    FROM invitations
    JOIN users AS users_sender ON invitations.sender_id = users_sender.id
    JOIN users AS users_receiver ON invitations.receiver_id = users_receiver.id
    WHERE invitations.id = $1;
  `;

  const values = [invitation_id];

  try{
    const result = await pool.query(query, values);
    const senderInfo = {
      receiver_username: result.rows[0].receiver_username,
      sender_email: result.rows[0].sender_email,
      date: result.rows[0].date,
    };
    sendAcceptanceMail(senderInfo.sender_email, senderInfo.receiver_username, senderInfo.date);
    res.status(200);
    res.json("Email sent!")
  } catch(error){
    res.status(500).json({ error: "Cannot send rejection email" });
  }

})

//fetch all upcoming events with status set to accepted
app.get('/allUpcomingEvents', async (req, res)=>{

  const now = new Date(); // Get the current date and time

    // Query the database to get the invitations with the desired conditions
    const query = `
      SELECT
        sender.username as sender_username,
        sender.email as sender_email,
        receiver.username as receiver_username,
        receiver.email as receiver_email
      FROM invitations
      INNER JOIN users AS sender ON invitations.sender_id = sender.id
      INNER JOIN users AS receiver ON invitations.receiver_id = receiver.id
      WHERE
        status = 'accepted' AND
        (date = $1 AND start_time > $2)
    ;`

    const values = [now.toISOString().slice(0, 10), now.toISOString().slice(11, 19)];
    try{ 
      const result = await pool.query(query, values);
      res.json(result.rows);

    }catch(error){
      res.status(500).json({ error: "Cannot fetch all upcoming dates" });
    }
})



app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
