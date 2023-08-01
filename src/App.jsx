import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
import Details from "./pages/Details";
import AddDate from "./components/AddDate";
import Memories from "./pages/Memories";
import { reactRouterLoader as detailsPageLoader } from "./pages/Details";

export default function App() {
  const { user, dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  // React Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? (
        <>
          <DrawerAppBar /> <Home />
        </>
      ) : (
        <Login />
      ),
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
      element: !user ? (
        <Navigate to="/" />
      ) : (
        <>
          {" "}
          <DrawerAppBar /> <PublicDates />{" "}
        </>
      ),
      children: [
        {
          path: "/dates/:id",
          element: user ? (
            <>
              <DrawerAppBar />
              <Details />
            </>
          ) : (
            <Navigate to="/" />
          ),
          loader: detailsPageLoader,
        },
      ],
    },
    {
      path: "/dates/new",
      element: user ? (
        <>
          <DrawerAppBar />
          <AddDate />
        </>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/dates/add",
      element: user ? (
        <>
          <DrawerAppBar />
          <AddDate noDates={true}/>
        </>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/mydates",
      element: user ? (
        <>
          {" "}
          <DrawerAppBar /> <MyDates />{" "}
        </>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/memories",
      element: user ? (
        <>
          {" "}
          <DrawerAppBar /> <Memories />{" "}
        </>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/favorites",
      element: user ? (
        <>
          {" "}
          <DrawerAppBar /> <MyDates entryTab={"1"} />{" "}
        </>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/events",
      element: user ? (
        <>
          {" "}
          <DrawerAppBar /> <PublicDates entryTab={"1"} />{" "}
        </>
      ) : (
        <Navigate to="/" />
      ),
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
