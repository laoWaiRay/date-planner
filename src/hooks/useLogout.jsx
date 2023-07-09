import { logoutUser } from "../api/internal/postgres";
import { useAuthContext } from "./useAuthContext";

export function useLogout() {
  const { dispatch } = useAuthContext();

  async function logout() {
    await logoutUser()
    dispatch({type: "LOGOUT"});
  }

  return logout
}