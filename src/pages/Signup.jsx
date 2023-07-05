import Input from "../components/Input";
import useForm from "../hooks/useForm";
import GoogleLogo from '../assets/GoogleLogo.png'
import Hero from "../assets/Hero.jpg"
import { Link, useLoaderData } from "react-router-dom";

export default function Signup() {
  const [formState, handleInputChange] = useForm({
    "username": "",
    "email": "",
    "password": "",
    "confirmPassword": ""
  });

  const heroImg = useLoaderData();
  
  return (
    <div className="w-full min-h-screen flex">
      {/* Hero Image */}
      <div className="overflow-hidden">
        {heroImg}
      </div>

      {/* Form Sidebar*/}
      <main className="w-full min-h-screen ml-auto px-12 py-6 flex flex-shrink-0 flex-col 
      justify-center sm:w-[28rem] items-center">
        
        <form action="#" className="max-w-sm w-full">
          <h1 className="font-display text-blue-500 font-bold text-4xl mb-0">Date Planner</h1>
          <h2 className="font-semibold text-lg ml-[3px] tracking-wide mb-4">Create a new account</h2>

          {/* Main Form Section */}
          <section className="space-y-4 border-gray-100 border-b-2 pb-5">
            <Input id="username" name="username" label="Username" placeholder="Enter a username" 
            updateForm={handleInputChange} />
            <Input id="email" name="email" label="Email" placeholder="Enter email address" 
            updateForm={handleInputChange} />
            <Input id="password" name="password" label="Password" placeholder="Enter password" 
            updateForm={handleInputChange} type="password" />
            <Input id="confirmPassword" name="confirmPassword" label="Confirm Password" placeholder="Re-enter password" 
            updateForm={handleInputChange} type="password" />
            
            <button 
              className="w-full bg-blue-500 text-white font-semibold h-10 rounded-md"
            >
              Register
            </button>
          </section>

          {/* Alternate Login Section */}
          <section className="mt-6">
            <button
              type="button"
              className="w-full bg-gray-800 text-white h-10 rounded-md text-sm flex 
              items-center justify-center"
              id="g_id_onload"
              data-client_id="138188008135-tc9cmotoa6pblof57om9obfi9m6795ap.apps.googleusercontent.com"
              data-context="signup"
              data-ux_mode="popup"
              data-callback="googleSignUp"
              data-auto_prompt="false"
            >
              <img src={GoogleLogo} className="h-5 w-5 inline-block mr-2"></img>Or sign up with Google
            </button>
            {/* Google Identity Button */}

            <div class="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="filled_black"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
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