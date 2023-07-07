import { loginByUsername } from "../api/internal/postgres";

// function validateSignupForm(formState) {
//   let isValid = true;
//   let formErr = "";
//   let usernameErr = "";
//   let emailErr = "";
//   let passwordErr = "";
//   let confirmPasswordErr = "";

//   const {username="", email="", password="", confirmPassword=""} = formState;

//   if (username) {
//     if (username.trim().length < 3)
//       usernameErr = "Username must be 3 or more characters"
//   }

//   if (email) {
//     console.log("Email", email)
//   }

//   if (password) {
//     console.log("PW", password)
//   }

//   if (confirmPassword) {
//     console.log("CPW", confirmPassword)
//   }

//   // If no errors, attempt to register user on database
//   if (!formErr) {
    
//   }

//   return { isValid, formErr, usernameErr, emailErr, passwordErr, confirmPasswordErr };
// }

// Note: "username" variable can be in either a username or email format
function validateLoginForm(formState) {
  let isValid = true;
  let formErr = "";
  let usernameErr = "";
  let passwordErr = "";
  let loginMethod; // Either "username" or "email"

  const {username="", password=""} = formState;

  if (username.includes("@")) {
    loginMethod = "email";
    // Email format checks
    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(username)) {
      usernameErr = "Invalid email"
    }
  } else {
    loginMethod = "username";
    // Username format checks
    if (username.trim().length < 3) {
      usernameErr = "Username must be 3 or more characters"
    }
  }

  if (password.trim().length < 3) {
    passwordErr = "Password must be 3 or more characters"
  }
  

  // If no errors, attempt db lookup
  if (!formErr) {

  }

  return { isValid, formErr, usernameErr, passwordErr };
}

export { validateLoginForm }