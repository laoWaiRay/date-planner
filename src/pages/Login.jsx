import Input from "../components/Input";
import useForm from "../hooks/useForm";

export default function Login() {
  const [formState, handleInputChange] = useForm({
    "username": "",
    "password": "",
  });
  
  return (
    <div className="w-full h-screen">
      <Input id="username" name="username" label="Username" placeholder="Enter your username" 
      updateForm={handleInputChange} />

      {formState?.username}
    </div>
  )
}
