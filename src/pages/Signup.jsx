import Input from "../components/Input";
import useForm from "../hooks/useForm";
import Hero from "../assets/Hero.jpg"
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { renderGoogleBtn } from "../GoogleIdentity";
import { validateSignupForm } from "../helpers/formValidator";
import { signupUser, getUserByEmail, getUserByUsername } from "../api/internal/postgres";
import { useAuthContext } from "../hooks/useAuthContext";

const DEBOUNCE_INTERVAL = 500;

export default function Signup() {
  const [formState, handleInputChange] = useForm({
    "username": "",
    "email": "",
    "password": "",
    "confirmPassword": ""
  });
  const [errors, setErrors] = useState({
    form: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errorMessagesEnabled, setErrorMessagesEnabled] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const heroImg = useLoaderData();

  // Render the Google sign in button
  useEffect(() => {
    renderGoogleBtn("googleSignInBtn", "signup");
  }, [])

  // Update error messages on input change if user has already attempted to submit form
  useEffect(() => {
    if (!errorMessagesEnabled) {
      return;
    }

    let { errors: { username, email, password, confirmPassword } } 
        = validateSignupForm(formState);

    {/* Debounce queries to DB for login availability.
        This is to refresh the error message that is set when a login
        has already been taken whenever the user changes the input. */}
    const timeoutId = setTimeout(async() => {
      const resultEmail = await getUserByEmail(formState.email);
      const resultUsername = await getUserByUsername(formState.username);
      // Username/email are available
      if (resultEmail.error || resultUsername.error) {
        setErrors({
          form: "",
          username, email, password, confirmPassword
        })
      } else {
        // Username/email are taken
        setErrors({
          form: "Username/email already taken",
          username, email, password, confirmPassword
        })
      }
    }, DEBOUNCE_INTERVAL)

    return () => clearTimeout(timeoutId);
  }, [formState])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState) {
      let {isValid, errors: {form, username, email, password, confirmPassword} } 
          = validateSignupForm(formState);

      // Form is validated on client, attempt to signup user on server
      if (isValid) {
        const result = await signupUser(formState);
        
        // Auth failed - username/email already exists on server
        if (result.error) {
          isValid = false;
          form = result.error;  // Set the form error
        } else {
          // On successful login, session data is created on the server.
          // Store client state and redirect user
          dispatch({type: "LOGIN", payload: result});
          navigate("/");
        }
      }

      setErrors({form, username, email, password, confirmPassword});
      // Show error messages
      setErrorMessagesEnabled(true);
    }
  }
  
  return (
    <div className="w-full min-h-screen flex">
      {/* Hero Image */}
      <div className="overflow-hidden">
        {heroImg}
      </div>

      {/* Form Sidebar*/}
      <main className="w-full min-h-screen ml-auto px-12 py-6 flex flex-shrink-0 flex-col 
      justify-center sm:w-[28rem] items-center">
        
        <form onSubmit={(e) => handleSubmit(e)} className="max-w-sm w-full">
          <h1 className="font-display text-blue-500 font-bold text-4xl mb-0">Date Planner</h1>
          <h2 className="font-semibold text-lg ml-[3px] tracking-wide mb-4">Create a new account</h2>

          {/* Error Message Popup */}
          { errors.form &&
            <div className="my-4 ml-1 text-red-500">{errors.form}</div>
          }

          {/* Main Form Section */}
          <section className="space-y-4 border-gray-100 border-b-2 pb-5">
            <Input id="username" name="username" label="Username" placeholder="Enter a username" 
            updateForm={handleInputChange} errorMessage={errors.username}/>
            <Input id="email" name="email" label="Email" placeholder="Enter email address" 
            updateForm={handleInputChange} errorMessage={errors.email} />
            <Input id="password" name="password" label="Password" placeholder="Enter password" 
            updateForm={handleInputChange} type="password" errorMessage={errors.password} />
            <Input id="confirmPassword" name="confirmPassword" label="Confirm Password" placeholder="Re-enter password" 
            updateForm={handleInputChange} type="password" errorMessage={errors.confirmPassword} />
            
            <button 
              className="w-full bg-blue-500 text-white font-semibold h-10 rounded-md hover:brightness-110 transition duration-200"
            >
              Register
            </button>
          </section>

          {/* Alternate Login Section */}
          <section className="mt-6">
            {/* Root element for google button */}
            <div className="h-[40px] relative">
              <div className="absolute w-full" id="googleSignInBtn" />
            </div>

            <div className="text-sm mt-8 flex justify-center">
              Already have an account?
              <Link to="/login" className="ml-3">Log in</Link>
            </div>
          </section>
        </form>
      </main>
    </div>
  )
}

// Preload large hero image
export function loader() {
  return (<img src={Hero} className="object-cover w-full h-full" alt="Concert Lights" />);
}