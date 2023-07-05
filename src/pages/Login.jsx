import Input from "../components/Input";
import useForm from "../hooks/useForm";

export default function Login() {
  const [formState, handleInputChange] = useForm({
    "username": "",
    "password": "",
  });
  
  return (
    <div className="w-full h-screen">
      <main className="max-w-md h-screen ml-auto px-12 py-6">
        <h1 className="font-display text-blue-500 font-bold text-4xl mb-0">Date Planner</h1>
        <h2 className="font-semibold text-lg ml-[3px] tracking-wide mb-4">Nice to see you again</h2>
        <form action="#" className="space-y-4">
          <Input id="username" name="username" label="Login" placeholder="Email or username" 
          updateForm={handleInputChange} />
          <Input id="password" name="password" label="Password" placeholder="Enter password" 
          updateForm={handleInputChange} type="password" />

          
        </form>
      </main>
    </div>
  )
}
