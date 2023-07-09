import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "../api/internal/postgres";

export default function RequireAuth() {
  (async () => {
  let session = await getSession()

  if (!session.username) {
    return <Navigate to="/login" />
  }

  return (
    <Outlet />
  )
  })()
}
