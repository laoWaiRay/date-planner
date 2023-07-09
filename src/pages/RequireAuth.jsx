import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSession } from "../api/internal/postgres";

export default function RequireAuth({ children }) {
  const [session, setSession] = useState(getSession());

  useEffect(() => console.log(session))

  if (!session) {
    return <Navigate to="/login" />
  }

  return children;
}
