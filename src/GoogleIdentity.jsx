// Google Identity helper functions
import jwt_decode from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import {
  getUserByEmail,
  getUserByUsername,
  loginWithGoogle,
  signupUser
} from "./api/internal/postgres";

function initGoogleIdentity(handleCallbackResponse) {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleCallbackResponse,
  });
}

// PARAMS - elementId: id attribute of element to append the button to
//          type: signup | login
function renderGoogleBtn(elementId, type = "signup") {
  const btnText = type === "signup" ? "signup_with" : "signin_with";

  window.google.accounts.id.renderButton(document.getElementById(elementId), {
    type: "standard",
    theme: "filled_black",
    size: "large",
    text: btnText,
    width: "352px",
  });
}

// This is the callback that runs whenever a user successfully
// authenticates using the Google Identity button.
// PARAMS - response: the default response object returned by Google
//          dispatch: the dispatch function for the auth context
async function handleCallbackResponse(response, dispatch) {
  const userObj = jwt_decode(response.credential);
  const { name, email } = userObj;

  // Automatically generated password because the it is a required field in database.
  const password = uuidv4();
  let username = name.split(" ").join("").toLowerCase();

  // Check whether or not user exists in DB
  let userEmail = await getUserByEmail(email);
  let userUsername = await getUserByUsername(username);
  let userData;
  
  // If the user email is not registered in DB, sign them up using their Google credential token
  if (userEmail.error) {
    // Username is already taken, append a random number (usernames should be unique)
    if (!userUsername.error) {
      username = username.concat(Math.floor(Math.random() * 10));
      userUsername = await getUserByUsername(username);
    }
    userData = await signupUser({ username, email, password });
  } else {
    userData = userEmail;
  }

  // Open a session using Google credential token
  await loginWithGoogle(response.credential);
  dispatch({ type: "LOGIN", payload: userData });
}

export { initGoogleIdentity, renderGoogleBtn, handleCallbackResponse };
