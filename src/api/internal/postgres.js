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

async function createInvitation(sender_id, receiver_id, event_id, status, date, start_time){
  const res = await fetch(`http://localhost:8000/createInvite?sender_id=${sender_id}&receiver_id=${receiver_id}&event_id=${event_id}&status=${status}&date=${date}&start_time=${start_time}`, {
    ...fetchOptions.POST
  });
}

async function updateInviteStatus(invite_id, status){
  const res = await fetch(`http://localhost:8000/updateInviteStatus?invite_id=${invite_id}&status=${status}`,
    ...fetchOptions.POST
  );
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


// Returns
async function getSession() {
  const res = await fetch("http://localhost:8000/users/session", fetchOptions.GET);
  const data = await res.json();
  return data;
}

async function logoutUser() {
  await fetch("http://localhost:8000/users/logout", fetchOptions.GET);
}

async function loginWithGoogle(token) {
  await fetch("http://localhost:8000/users/login/google", fetchOptions.BEARER_TOKEN(token));
}

export {
  loginUser,
  signupUser,
  getUsers,
  getUserByEmail,
  getUserByUsername,
  getSession,
  logoutUser,
  loginWithGoogle,
  createInvitation
};