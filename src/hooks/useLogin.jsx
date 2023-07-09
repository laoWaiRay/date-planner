import { loginUser } from "../api/internal/postgres";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

// Throws error if login failed: Should be used with in a try catch block
// Should only be called inside of Auth Context and Router Provider
export default function useLogin() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  async function login(userData) {
    // Send message to server to open a session
    const result = await loginUser(userData);
    
    // Auth failed - throw error message
    if (result.error) {
      throw new Error(result.error);
    } else {
      // Auth success - Set client state user object in Auth Context
      dispatch({type: "LOGIN", payload: result});
      // redirect back to home
      navigate("/");
    }
  }

  return login
}
