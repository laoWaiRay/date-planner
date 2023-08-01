import { Switch } from "@mui/material";
import Input from "../components/Input";
import useForm from "../hooks/useForm";
import Hero from "../assets/Hero.jpg";
import LoginVideo from "../assets/login/login-video.mp4";
import { useLoaderData, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { renderGoogleBtn } from "../GoogleIdentity";
import { validateLoginForm } from "../helpers/formValidator";
import useLogin from "../hooks/useLogin";

export default function Login() {
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({
    form: "",
  });
  const [errorMessagesEnabled, setErrorMessagesEnabled] = useState(false);
  const [rememberMeChecked, setRememberMeChecked] = useState(true);
  const login = useLogin();

  const [formState, handleInputChange] = useForm({
    username: "",
    password: "",
  });

  const heroImg = useLoaderData();

  useEffect(() => {
    renderGoogleBtn("googleSignInBtn", "login");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side input validation
    let {
      isValid,
      errors: { form },
    } = validateLoginForm(formState);

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
      form = "Invalid login credentials";
    }

    // Set error messages state
    setIsValid(isValid);
    setErrors({ form });
  };

  return (
    <div className="w-full min-h-screen flex">
      {/* Hero Image */}
      <div
        className="overflow-hidden"
        style={{ background: "linear-gradient(#397b8e, #323335)" }}
      >
        {/* {heroImg} */}
        <video className="" autoPlay loop muted style={{ height: "100vh" }}>
          <source src={LoginVideo} type="video/mp4" />
        </video>
      </div>

      {/* Form Sidebar*/}
      <main className="w-full min-h-screen ml-auto px-12 py-6 flex flex-shrink-0 flex-col 
      justify-center sm:w-[28rem] items-center">
        
        <form onSubmit={(e) => handleSubmit(e)} className="mb-10 max-w-sm w-full">
          <div className="flex items-center">
            <svg className="w-[2rem] mr-4 fill-[#39798f] -translate-y-1" viewBox="0 0 72.25 95"><defs><style>.cls-1</style></defs><path className="cls-1" d="M15.64,25.63a40.06,40.06,0,0,0-.3,23.67c.14-1.11.08-2.23.17-3.35a24.9,24.9,0,0,1,5.91-14.14,52.38,52.38,0,0,0,5-6.58,20.78,20.78,0,0,0,2.82-9.61A35.75,35.75,0,0,0,26.92,1.4,5.08,5.08,0,0,1,26.5.06c.24-.15.38,0,.52.1A71.31,71.31,0,0,1,41.31,11.41a44.33,44.33,0,0,1,11.48,20,35.27,35.27,0,0,1,.92,11.12,5.19,5.19,0,0,0,1.53-1.26,12.78,12.78,0,0,0,2.88-7.77,17.89,17.89,0,0,0-.2-4.43c.4,0,.48.3.62.48a100.39,100.39,0,0,1,8.22,13A47.45,47.45,0,0,1,72.21,62c.39,8.38-2.37,15.66-7.62,22.08A48.09,48.09,0,0,1,52,94.75c-.19.11-.39.37-.6.19s0-.43.08-.64a49.74,49.74,0,0,0,2.22-8.9c.56-4.49,0-8.75-2.7-12.53a1.25,1.25,0,0,0-.09-.12c-.22-.23-.36-.68-.71-.6s-.23.52-.31.79a12.05,12.05,0,0,1-6.39,7.55c-.26.12-.56.42-.83.18s0-.52.09-.77A29.51,29.51,0,0,0,30.6,46.8c-.16-.11-.33-.31-.54-.22s-.06.32,0,.48c1.46,6.62-.22,12.42-4.53,17.56a34.94,34.94,0,0,0-4.08,5.57,18.51,18.51,0,0,0-2.29,7.89A28.38,28.38,0,0,0,23.2,94.27c.12.21.33.39.31.69-.29.13-.48-.09-.69-.19a44.9,44.9,0,0,1-17-14.53A32,32,0,0,1,0,63.06,43.3,43.3,0,0,1,4.24,43.41c2.86-6.35,6.81-12,11-17.56A.44.44,0,0,1,15.64,25.63Z"/></svg>
            <h1 className="font-display text-blue-500 font-bold text-4xl mb-0 select-none" style={{color: "#39798f"}}>
              Ignite
            </h1>
          </div>
          <h2 className="font-semibold text-lg ml-[3px] tracking-wide mb-4 select-none">Nice to see you again</h2>

          {/* Error Message Popup */}
          {!isValid && errors.form && (
            <div className="my-4 ml-1 text-red-500">{errors.form}</div>
          )}

          {/* Main Form Section */}
          <section className="space-y-4 border-b-2 border-gray-200 pb-4">
            <Input id="username" name="username" label="Login" placeholder="Email or username" 
            updateForm={handleInputChange} />
            <Input id="password" name="password" label="Password" placeholder="Enter password" 
            updateForm={handleInputChange} type="password" />
            
            <button 
              className="w-full bg-blue-500 text-white font-semibold h-10 rounded-md 
              hover:brightness-110 transition duration-200 !mt-8"
              style={{backgroundColor: "#39798f"}}
            >
              Sign in
            </button>
          </section>

          {/* Alternate Login Section */}
          <section className="mt-4">
            {/* Root element for google button */}
            <div className="h-[40px] relative">
              <div className="absolute w-full" id="googleSignInBtn" />
            </div>

            <div className="text-sm mt-8 flex justify-center">
              Don't have an account?
              <Link to="/signup" className="ml-3" style={{ color: "#39798f" }}>
                Sign up now
              </Link>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}

// Preload large hero image
export function loader() {
  return (
    <img
      src={Hero}
      className="object-cover w-full h-full"
      alt="Concert Lights"
    />
  );
}