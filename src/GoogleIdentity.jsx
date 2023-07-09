function initGoogleIdentity(handleCallbackResponse) {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleCallbackResponse
  });
}

// params: elementId - id attribute of element to append the button to
//         type - signup | login
function renderGoogleBtn(elementId, type="signup") {
  const btnText = type === "signup" ? "signup_with" : "signin_with";

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

export { initGoogleIdentity, renderGoogleBtn }