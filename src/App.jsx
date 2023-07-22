import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./pages/Home";
import Login, { loader as loginLoader } from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import Signup from "./pages/Signup";
import PublicDates from "./pages/PublicDates";
import MyDates from "./pages/MyDates";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect, useState } from "react";
import { getSession } from "./api/internal/postgres";
import { initGoogleIdentity, handleCallbackResponse } from "./GoogleIdentity";
import DrawerAppBar from "./components/Header";
import HomeScreen from "./components/HomeScreen";

export default function App() {
  const { user, dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  // React Router
  // TODO: Uncomment/add protected routes
  const router = createBrowserRouter([
    {
      path: "/",
      // element: user ? <Home /> : <Login />,
      element: user ? <div><DrawerAppBar /> <HomeScreen /></div> : <Login />,
      loader: loginLoader,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
      loader: loginLoader,
    },
    {
      path: "/signup",
      element: user ? <Navigate to="/" /> : <Signup />,
      loader: loginLoader,
    },
    {
      path: "/dates",
      element: !user ? <Navigate to="/" /> : <> <DrawerAppBar /> <PublicDates /> </>,
      loader: loginLoader,
    },
    {
      path: "/mydates",
      element: user ? <> <DrawerAppBar /> <MyDates /> </> : <Navigate to="/" />, 
      loader: loginLoader,
    },
  ]);

  // On page refresh, make a call to DB to restore client-side state about
  // any existing sessions
  useEffect(() => {
    async function getSessionDetails() {
      setIsLoading(true);
      const session = await getSession();
      if (session.error) {
        dispatch({ type: "LOGOUT" });
      } else {
        dispatch({ type: "LOGIN", payload: session });
      }
      setIsLoading(false);
    }

    getSessionDetails();
  }, []);

  // Google Identity init
  useEffect(() => {
    const callbackWrapper = (response) =>
      handleCallbackResponse(response, dispatch);
    initGoogleIdentity(callbackWrapper);
  }, []);

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {!isLoading && <RouterProvider router={router} />}
    </>
  );
}
