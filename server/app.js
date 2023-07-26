import express from "express";
import pg from "pg";
import cors from "cors";
import session from "express-session";
import userRouter from "./routes/users.js";
import reviewRouter from "./routes/reviews.js"
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const app = express();
const PORT = 8000;
const ticketmaster_api = process.env.TICKETMASTER_API_KEY;

const pool = new pg.Pool({
  user: "postgres",
  password: "root",
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
                      WHERE author='${userid}' AND isticketmasterevent = 'f';`
  } else if (category !== undefined && (price == "all" || price === undefined)) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE category='${category}' AND author='${userid}' AND isticketmasterevent = 'f';`
  } else if (price !== undefined && (category == "all" || category === undefined)) {
    var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE price='${price}' AND author='${userid}' AND isticketmasterevent = 'f';`
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

app.get("/publicdates", async (req, res) => {
  var category = req.query.category
  var price = req.query.price
  // var myDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments FROM events`;

  if ((category == "all" && price == "all") || (category === undefined && price === undefined)) {
    var publicDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                      locations.city, locations.country, locations.detailed_address  
                      FROM events INNER JOIN locations ON events.location_id = locations.id WHERE private='f';`
  } else if (category !== undefined && (price == "all" || price === undefined)) {
    var publicDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE category='${category}' AND private='f';`
  } else if (price !== undefined && (category == "all" || category === undefined)) {
    var publicDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE price='${price}' AND private='f';`
  } else if (category !== undefined && price !== undefined) {
    var publicDatesQuery = `SELECT events.id, events.title, events.description, events.author, events.price, events.category, events.preferred_time, events.comments, events.image,
                        locations.city, locations.country, locations.detailed_address  
                        FROM events INNER JOIN locations ON events.location_id = locations.id
                        WHERE category='${category}' AND price='${price}' AND private='f';`
  }

  await pool.query(publicDatesQuery, (err, result) => {
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
  console.log(checkFavQuery)
  const favResult = await pool.query(checkFavQuery, [userid, eventid]);

  if (favResult.rows.length == 0) {
    console.log("INSERTING FAV")
    var addFavoriteQuery = `INSERT INTO saved(user_id,event_id) VALUES(${userid},'${eventid}')`
    await pool.query(addFavoriteQuery, (err, result) => {
      if (err) {
        console.log(err)
        res.end(err);
      }
    }) 
  }
});


app.delete("/favorites", async (req, res) => {
  var del_userid = req.query.user
  var del_eventid = req.query.event
  console.log("DELETING FAV",del_userid,del_eventid)

  var delFavoriteQuery = `DELETE FROM saved WHERE user_id='${del_userid}' AND event_id='${del_eventid}'`

  await pool.query(delFavoriteQuery, (err, result) => {
    if (err) {
      console.log(err)
      res.end(err);
    }
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
      // console.log(response);
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
      console.log("ERROR HERE")
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

  const isTicketmasterEvent = isAPIevt(event_id);

  // If the event is from Ticketmaster, add it to the events table before sending an invitation
  if (isTicketmasterEvent) {
    // Check if it already exists and insert if it doesn't
    const result = await pool.query(`SELECT * FROM events WHERE id = $1 AND isticketmasterevent = true`, [event_id]);
    if (result.rows.length == 0) {
      await pool.query(`INSERT INTO events(id, title, isticketmasterevent) VALUES ($1, $2, $3)`, [
        event_id, event_id, true
      ]);
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

//fetch a users pending invites
app.get("/pendingUserInvites", async (req, res) =>{
  
  const user_id = req.query.user_id;
  
  console.log(user_id)
    // Define INSERT query
   const selectQuery = `
  SELECT 
    users.username AS sender_username,
    users.avatar AS sender_avatar_url,
    invitations.start_time AS invitation_start_time,
    invitations.date AS invitation_date,
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
app.get("/upcomingUserInvites", async (req, res) =>{
  const user_id = req.query.user_id;
    // Define INSERT query
    const currentDate = new Date();
    const selectQuery = `
      SELECT * 
      FROM invitations 
      WHERE (receiver_id = $1 OR sender_id = $2) 
        AND status = $3
        AND (date > $4 OR (date = $4 AND start_time < $5));
    `;

    const values = [user_id, user_id, "accepted", currentDate.toISOString().slice(0, 10), currentDate.toISOString().slice(11, 19)];

  try {
    const result = await pool.query(selectQuery, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Cannot select users upcoming invitations" });
  }
})

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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const isAPIevt = (id) => {
  return id.length > 10;
}
