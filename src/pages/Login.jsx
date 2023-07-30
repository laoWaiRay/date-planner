import { Switch } from "@mui/material";
import Input from "../components/Input";
import useForm from "../hooks/useForm";
import Hero from "../assets/Hero.jpg"
import LoginVideo from "../assets/login/login-video.mp4"
import { useLoaderData, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { renderGoogleBtn } from "../GoogleIdentity";
import { validateLoginForm } from "../helpers/formValidator";
import useLogin from "../hooks/useLogin";

export default function Login() {
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({
    form: "",
  })
  const [errorMessagesEnabled, setErrorMessagesEnabled] = useState(false);
  const [rememberMeChecked, setRememberMeChecked] = useState(true);
  const login = useLogin();

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
    // Client-side input validation
    let {isValid, errors: {form} } = validateLoginForm(formState);

    // Form is validated on client, attempt to login user on server
    if (isValid) {
      try {
        await login(formState);
      } catch (error) {
        console.log(error);
        isValid = false;
        form = error.message;
      }
    } else {
      form = "Invalid login credentials"
    }

    // Set error messages state
    setIsValid(isValid);
    setErrors({form});
  }
  
  return (
    <div className="w-full min-h-screen flex">
      {/* Hero Image */}
      <div className="overflow-hidden" style={{background: "linear-gradient(#397b8e, #323335)"}}>
        {/* {heroImg} */}
        <video className="" autoPlay loop muted style={{height: "100vh" }}>
          <source src={LoginVideo} type='video/mp4' />
        </video>
      </div>

      {/* Form Sidebar*/}
      <main className="w-full min-h-screen ml-auto px-12 py-6 flex flex-shrink-0 flex-col 
      justify-center sm:w-[28rem] items-center">
        
        <form onSubmit={(e) => handleSubmit(e)} className="mb-10 max-w-sm w-full">
          <h1 className="font-display text-blue-500 font-bold text-4xl mb-0" style={{color: "#39798f"}}>Date Planner</h1>
          <h2 className="font-semibold text-lg ml-[3px] tracking-wide mb-4">Nice to see you again</h2>

          {/* Error Message Popup */}
          { !isValid && errors.form &&
            <div className="my-4 ml-1 text-red-500">{errors.form}</div>
          }

          {/* Main Form Section */}
          <section className="space-y-4 border-b-2 pb-8 border-gray-100">
            <Input id="username" name="username" label="Login" placeholder="Email or username" 
            updateForm={handleInputChange} />
            <Input id="password" name="password" label="Password" placeholder="Enter password" 
            updateForm={handleInputChange} type="password" />

            <div className="w-full">
              <div className="w-full flex items-center">
                {/* <Switch 
                  checked={rememberMeChecked} 
                  onClick={() => setRememberMeChecked(!rememberMeChecked)}
                />
                <span className="text-sm">Remember me</span> */}
                <a className="text-sm ml-auto mr-4" style={{color: "#39798f"}}>Forgot password?</a>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-500 text-white font-semibold h-10 rounded-md 
              hover:brightness-110 transition duration-200"
              style={{backgroundColor: "#39798f"}}
            >
              Sign in
            </button>
          </section>

          {/* Alternate Login Section */}
          <section className="mt-8">
            {/* Root element for google button */}
            <div className="h-[40px] relative">
              <div className="absolute w-full" id="googleSignInBtn" />
            </div>

            <div className="text-sm mt-8 flex justify-center">
              Don't have an account?
              <Link to="/signup" className="ml-3" style={{color: "#39798f"}}>Sign up now</Link>
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