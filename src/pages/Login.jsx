import { Switch } from "@mui/material";
import Input from "../components/Input";
import useForm from "../hooks/useForm";
import GoogleLogo from '../assets/GoogleLogo.png'
import Hero from "../assets/Hero.jpg"
import { useLoaderData, Link } from "react-router-dom";

export default function Login() {
  const [formState, handleInputChange] = useForm({
    "username": "",
    "password": "",
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
        
        <form action="#" className="mb-10 max-w-sm w-full">
          <h1 className="font-display text-blue-500 font-bold text-4xl mb-0">Date Planner</h1>
          <h2 className="font-semibold text-lg ml-[3px] tracking-wide mb-4">Nice to see you again</h2>

          {/* Main Form Section */}
          <section className="space-y-4 border-b-2 pb-8 border-gray-100">
            <Input id="username" name="username" label="Login" placeholder="Email or username" 
            updateForm={handleInputChange} />
            <Input id="password" name="password" label="Password" placeholder="Enter password" 
            updateForm={handleInputChange} type="password" />

            <div className="w-full">
              <div className="w-full flex items-center">
                <Switch /> <span className="text-sm">Remember me</span>
                <a className="text-sm ml-auto mr-4">Forgot password?</a>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-500 text-white font-semibold h-10 rounded-md"
            >
              Sign in
            </button>
          </section>

          {/* Alternate Login Section */}
          <section className="mt-8">
            <button 
              className="w-full bg-gray-800 text-white h-10 rounded-md text-sm flex 
              items-center justify-center"
            >
              <img src={GoogleLogo} className="h-5 w-5 inline-block mr-2"></img>Or sign in with Google
            </button>

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