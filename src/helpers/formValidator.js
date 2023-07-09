function validateSignupForm(formState) {
  let isValid = true;
  const errors = {
    form: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  const {username, email, password, confirmPassword} = formState;

  errors.username = validateUsername(username);
  errors.email = validateEmail(email);
  errors.password = validatePassword(password);

  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords must match";
  
  isValid = isFormValid(errors);

  return { isValid, errors };
}

// Note: "username" variable can be in either a username or email format
function validateLoginForm(formState) {
  let isValid = true;
  let loginMethod; // Either "username" or "email"
  const errors = {
    form: "",
    username: "",
    password: ""
  }

  const {username, password} = formState;

  if (username.includes("@")) {
    loginMethod = "email";
    // Email format checks
    errors.username = validateEmail(username);
  } else {
    loginMethod = "username";
    // Username format checks
    errors.username = validateUsername(username);
  }

  errors.password = validatePassword(password);

  isValid = isFormValid(errors);

  return { isValid, errors };
}

// Helpers
function validateUsername(username) {
  if (username.trim().length < 3) {
    return "Username must be 3 or more characters";
  }
  const alphaNumRegex = /^[0-9a-zA-Z]+$/;
  if (!username.trim().match(alphaNumRegex)) {
    return "Username must be alphanumeric and not contain any spaces";
  }
  return "";
}

function validateEmail(email) {
  const emailRegex = /.+\@.+\..+/;
  if (!emailRegex.test(email)) {
    return "Invalid email";
  }
  return "";
}

function validatePassword(password) {
  if (password.trim().length < 3) {
    return "Password must be 3 or more characters"
  }
  return "";
}

// Return true if there are no error messages in the given errors object
function isFormValid(errors) {
  let valid = true;
  Object.values(errors).forEach((value) => {
    if (value) valid = false;
  })
  return valid;
}

export { validateLoginForm, validateSignupForm }