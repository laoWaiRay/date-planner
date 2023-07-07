// Methods for contacting postgres server

// Params: userData - object containing username/email and password
async function loginByUsername(userData) {
  const res = await fetch("http://localhost:8000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const user = await res.json();

}

function loginByEmail() {
  // const user = fetch()
}

export { loginByUsername }