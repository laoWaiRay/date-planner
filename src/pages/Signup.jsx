import Input from "../components/Input";
import useForm from "../hooks/useForm";
// import GoogleLogo from '../assets/GoogleLogo.png'
import Hero from "../assets/Hero.jpg"
import { Link, useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { renderGoogleBtn } from "../GoogleIdentity";

export default function Signup() {
  const [formState, handleInputChange] = useForm({
    "username": "",
    "email": "",
    "password": "",
    "confirmPassword": ""
  });

  const heroImg = useLoaderData();

  // Render the Google sign in button
  useEffect(() => {
    renderGoogleBtn("googleSignInBtn", "signup");
  }, [])
  
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
              className="w-full bg-blue-500 text-white font-semibold h-10 rounded-md hover:brightness-110 transition duration-200"
            >
              Register
            </button>
          </section>

          {/* Alternate Login Section */}
          <section className="mt-6">
            {/* Root element for google button */}
            <div id="googleSignInBtn" />

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