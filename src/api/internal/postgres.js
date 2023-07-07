// Methods for contacting postgres server

// Params: userData - object containing username/email and password
async function loginUser(userData) {
  const res = await fetch("http://localhost:8000/users/login", {
    method: "POST",
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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await res.json();

  return data;
}

export { loginUser, signupUser }