// Methods for making fetch calls to postgres server

// Options for different fetch calls
const fetchOptions = {
  POST: {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  },
  GET: {
    method: "GET",
    credentials :"include"
  },
  DELETE: {
    method: "DELETE",
    credentials: "include"
  },
  BEARER_TOKEN: (token) => {
    return {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    }
  }
}

// PARAMS: userData - object containing username and password fields
//                    where username can be in either username or email format
async function loginUser(userData) {
  const res = await fetch("http://localhost:8000/users/login", {
    ...fetchOptions.POST,
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  return data;
}

// PARAMS: userData - object containing username, email and password
async function signupUser(userData) {
  const res = await fetch("http://localhost:8000/users/new", {
    ...fetchOptions.POST,
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  return data;
}

//create an invite
async function createInvitation(sender_id, receiver_id, event_id, status, date, start_time){
  const res = await fetch(`http://localhost:8000/createInvite?sender_id=${sender_id}&receiver_id=${receiver_id}&event_id=${event_id}&status=${status}&date=${date}&start_time=${start_time}`, {
    ...fetchOptions.POST
  });
}

//update an invites status to pending/accepted/rejected
async function updateInviteStatus(invite_id, status){
  const res = await fetch(`http://localhost:8000/updateInviteStatus?invite_id=${invite_id}&status=${status}`,
    ...fetchOptions.POST
  );
}

//fetch all of a users pending dates (requested dates)
async function getPendingUserInvites(user_id){
  const res = await fetch(`http://localhost:8000/pendingUserInvites?user_id=${user_id}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

//fetch all of a users pending dates (requested dates)
async function getUpcomingUserInvites(user_id){
  const res = await fetch(`http://localhost:8000/upcomingUserInvites?user_id=${user_id}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Returns a list of all users
async function getUsers() {
  const res = await fetch("http://localhost:8000/users", fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Returns user with associated email, or an object 
// containing an error if not found
async function getUserByEmail(email) {
  const res = await fetch(`http://localhost:8000/users/email?email=${email}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Returns user with associated username, or an object 
// containing an error if not found
async function getUserByUsername(username) {
  const res = await fetch(`http://localhost:8000/users/username?username=${username}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Return user with matching ID
async function getUserById(id) {
  const res = await fetch(`http://localhost:8000/users/${id}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Returns current session if available
async function getSession() {
  const res = await fetch("http://localhost:8000/users/session", fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Refresh session with updated avatar and cover photo data
async function refreshSession() {
  const res = await fetch("http://localhost:8000/users/session/refresh", fetchOptions.GET);
  const data = await res.json();
  return data;
}

async function logoutUser() {
  await fetch("http://localhost:8000/users/logout", fetchOptions.GET);
}

async function loginWithGoogle(token) {
  await fetch("http://localhost:8000/users/login/google", fetchOptions.BEARER_TOKEN(token));
}

// Set user avatar photo
async function setAvatar(id, avatar) {
  await fetch(`http://localhost:8000/users/${id}/avatar`, {
    ...fetchOptions.POST,
    body: JSON.stringify({id, avatar})
  })
}

// Set user cover photo
async function setCoverPhoto(id, cover_photo) {
  await fetch(`http://localhost:8000/users/${id}/cover_photo`, {
    ...fetchOptions.POST,
    body: JSON.stringify({id, cover_photo})
  })
}


// EVENTS

async function getEventById(id) {
  const result = await fetch(`http://localhost:8000/events/${id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

async function deleteEvent(id ) {
  await fetch(`http://localhost:8000/events/${id}`, fetchOptions.DELETE);
}

// LOCATION

//Get all locations in database
async function getLocations() {
  const result = await fetch(`http://localhost:8000/locations`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

//Get location by id
async function getLocationById(id) {
  const result = await fetch(`http://localhost:8000/locations/${id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

// REVIEWS

// Add a review for a given event id
async function addReview(event_id, author_id, comment, score) {
  await fetch(`http://localhost:8000/reviews/${event_id}`, {
    ...fetchOptions.POST,
    body: JSON.stringify({
      id: event_id,
      author_id,
      comment,
      score
    })
  });
}

// Edit a review for a given review id
async function editReview(review_id, comment, score) {
  await fetch(`http://localhost:8000/reviews/${review_id}/edit`, {
    ...fetchOptions.POST,
    body: JSON.stringify({
      comment,
      score
    })
  })
}

// Get list of all reviews for a given event id
async function getReviews(event_id) {
  const result = await fetch(`http://localhost:8000/reviews/${event_id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

// Delete a review by review id
async function deleteReview(review_id) {
  await fetch(`http://localhost:8000/reviews/${review_id}`, fetchOptions.DELETE);
}

// Get average review score for a given event id
async function getAverageReviewScore(event_id) {
  const result = await fetch(`http://localhost:8000/reviews/${event_id}/average`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

//send a rejection email
async function sendEventRejectionEmail(invitation_id){
  const result = await fetch(`http://localhost:8000/rejectionEmail?invitation_id=${invitation_id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

async function sendEventAcceptanceEmail(invitation_id){
  const result = await fetch(`http://localhost:8000/acceptanceEmail?invitation_id=${invitation_id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

export {
  loginUser,
  signupUser,
  getUsers,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  getSession,
  refreshSession,
  logoutUser,
  loginWithGoogle,
  setAvatar,
  setCoverPhoto,
  createInvitation,
  getEventById,
  deleteEvent,
  getLocations,
  getLocationById,
  addReview,
  editReview,
  deleteReview,
  getReviews,
  getAverageReviewScore
};