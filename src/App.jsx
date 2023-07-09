import { 
  createBrowserRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { v4 as uuidv4 } from 'uuid'

import Home from './pages/Home'
import Login, { loader as loginLoader } from './pages/Login'
import ErrorPage from './pages/ErrorPage'
import Signup from './pages/Signup'
import { useAuthContext } from './hooks/useAuthContext'
import { useEffect, useState } from 'react'
import { getSession, getUserByEmail, getUserByUsername, loginWithGoogle, signupUser } from './api/internal/postgres'
import { initGoogleIdentity } from './GoogleIdentity'

export default function App() {
  const { user, dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  // React Router
  const router = createBrowserRouter([
    {
      path: '/',
      element: (user ? <Home /> : <Login />),
      loader: loginLoader,
      errorElement: <ErrorPage />
    },
    {
      path: '/login',
      element: (user ? <Navigate to="/"/> : <Login />),
      loader: loginLoader
    },
    {
      path: '/signup',
      element: (user ? <Navigate to="/"/> : <Signup />),
      loader: loginLoader
    }
  ])

    // On page refresh, make a call to DB to restore client-side state about 
    // any existing sessions
    useEffect(() => {
      async function getSessionDetails() {
        setIsLoading(true);
        const session = await getSession();
        if (session.error) {
          dispatch({type: "LOGOUT"});
        } else {
          dispatch({type: "LOGIN", payload: session});
        }
        setIsLoading(false);
      }
  
      getSessionDetails();
    }, [])

    // Google Identity Init
    useEffect(() => {
      // This is the callback that runs whenever a user successfully
      // authenticates using the Google Identity button
      async function handleCallbackResponse(response) {
        const userObj = jwt_decode(response.credential);
        const { name, email } = userObj;

        // Automatically generated password because the it is a required field in database.
        // TODO: Allow users who signed in with Google to reset their passwords
        const password = uuidv4();
        let username = name.split(" ").join("").toLowerCase();
        
        // Check whether or not user exists in DB
        let userEmail = await getUserByEmail(email);
        let userUsername = await getUserByUsername(username);
        let userData;
        // If the user email is not registered in DB, sign them up using their Google credential token
        if(userEmail.error) {
          // Username is already taken, append a random number
          if (!userUsername.error) {
            username.append(Math.floor(Math.random() * 10));
            userUsername = await getUserByUsername(username)
          }
          userData = await signupUser({username, email, password});
        } else {
          userData = userEmail;
        }

        // Open a session using Google credential token
        await loginWithGoogle(response.credential);
        dispatch({ type: "LOGIN", payload: userData });
      }
      
      initGoogleIdentity(handleCallbackResponse)
    }, [])

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {!isLoading && <RouterProvider router={router} />}
    </>
  )
}
