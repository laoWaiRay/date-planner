import { Switch } from "@mui/material";
import Input from "../components/Input";
import useForm from "../hooks/useForm";
import Hero from "../assets/Hero.jpg"
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { renderGoogleBtn } from "../GoogleIdentity";
import { validateLoginForm } from "../helpers/formValidator";
import { loginUser } from "../api/internal/postgres";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Login() {
  const [isValid, setIsValid] = useState(true);
  const [formErr, setFormErr] = useState("");
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const [formState, handleInputChange] = useForm({
    "username": "",
    "password": "",
  });

  const heroImg = useLoaderData();

  useEffect(() => {
    renderGoogleBtn("googleSignInBtn", "login")
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState) {
      let {isValid, errors: {form} } = validateLoginForm(formState);

      // Input is valid, attempt to login user
      if (isValid) {
        const result = await loginUser(formState);
        
        // Authentication failed
        if (result.error) {
          isValid = false;
          form = result.error;
        } else {
          // Auth success - store user data into authContext and redirect back to home
          dispatch({type: "LOGIN", payload: result});
          navigate("/");
        }
      }
      setIsValid(isValid);
      setFormErr(form)
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
        
        <form onSubmit={(e) => handleSubmit(e)} className="mb-10 max-w-sm w-full">
          <h1 className="font-display text-blue-500 font-bold text-4xl mb-0">Date Planner</h1>
          <h2 className="font-semibold text-lg ml-[3px] tracking-wide mb-4">Nice to see you again</h2>

          {/* Error Message Popup */}
          { !isValid && formErr &&
            <div className="my-4 ml-1 text-red-500">{formErr}</div>
          }

          {/* Main Form Section */}
          <section className="space-y-4 border-b-2 pb-8 border-gray-100">
            <Input id="username" name="username" label="Login" placeholder="Email or username" 
            updateForm={handleInputChange} />
            <Input id="password" name="password" label="Password" placeholder="Enter password" 
            updateForm={handleInputChange} type="password" />

            <div className="w-full">
              <div className="w-full flex items-center">
                <Switch 
                  checked={rememberMeChecked} 
                  onClick={() => setRememberMeChecked(!rememberMeChecked)}
                /> 
                <span className="text-sm">Remember me</span>
                <a className="text-sm ml-auto mr-4">Forgot password?</a>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-500 text-white font-semibold h-10 rounded-md 
              hover:brightness-110 transition duration-200"
            >
              Sign in
            </button>
          </section>

          {/* Alternate Login Section */}
          <section className="mt-8">
            {/* Root element for google button */}
            <div id="googleSignInBtn" />

            <div className="text-sm mt-8 flex justify-center">
              Don't have an account?
              <Link to="/signup" className="ml-3">Sign up now</Link>
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