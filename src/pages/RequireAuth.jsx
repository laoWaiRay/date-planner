import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  let auth = true;

  if (!auth) {
    return <Navigate to="/login" />
  }

  return children;
}
