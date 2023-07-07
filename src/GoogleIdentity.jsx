import jwt_decode from "jwt-decode"

// Only initialize Google Identity once
let initCalled = false;

// TODO: create a session and login/redirect user
function handleCallbackResponse(response) {
  const userObj = jwt_decode(response.credential);
  console.table(userObj);
}

async function initGoogleIdentity() {
  // Make sure external Google script is loaded first
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleCallbackResponse
  });
  initCalled = true;
}

// params: elementId - id attribute of element to append the button to
//         type - signup | login
async function renderGoogleBtn(elementId, type="signup") {
  if (!initCalled)
    await initGoogleIdentity();
  
  const btnText = type === "signup" ? "signup_with" : "login_with";

  window.google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: btnText,
      width: "352px",
    }
  )
}

export { renderGoogleBtn, handleCallbackResponse }