// Methods for contacting postgres server

// Params: userData - object containing username/email and password
async function loginUser(userData) {
  const res = await fetch("http://localhost:8000/users/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  
  return data;
}

// Params: userData - object containing signup data
async function signupUser(userData) {
  const res = await fetch("http://localhost:8000/users/new", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await res.json();

  return data;
}

// Returns a list of all users
async function getUsers() {
  const res = await fetch("http://localhost:8000/users", { credentials: "include" });
  const data = await res.json();
  return data;
}

// Returns user with associated email + username
async function getUserByLogin(username, email) {
  const res = await fetch(`http://localhost:8000/users/query?username=${username}&email=${email}`, 
  {
    credentials: "include"
  });
  const data = await res.json();
  return data;
}

async function getSession() {
  const res = await fetch("http://localhost:8000/session", {
    credentials: "include"
  });
  const data = await res.json();
  console.log(data);
  return data;
}

async function logoutUser() {
  await fetch("http://localhost:8000/logout", {
    credentials: "include"
  });
}

async function loginWithGoogle(token) {
  await fetch("http://localhost:8000/login/google", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
}

export { loginUser, signupUser, getUsers, getUserByLogin, getSession, 
  logoutUser, loginWithGoogle }