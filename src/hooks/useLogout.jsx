import { logoutUser } from "../api/internal/postgres";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

// Should only be called inside of Auth Context and Router Provider
export default function useLogout() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  async function logout() {
    // Send message to server to close session
    await logoutUser();
    // Set user on client state to null
    dispatch({type: "LOGOUT"});
    // Redirect user to home
    navigate("/login");
  }

  return logout
}