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
import { getSession, getUserByLogin, loginWithGoogle, signupUser } from './api/internal/postgres'
import { initGoogleIdentity } from './GoogleIdentity'

export default function App() {
  const { user, isLoaded, dispatch } = useAuthContext();
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
      async function handleCallbackResponse(response) {
        const userObj = jwt_decode(response.credential);
        console.log(userObj)
        console.table(userObj);
        const { name, email } = userObj;
        const password = uuidv4();
        
        let userData = await getUserByLogin(name, email);
        // User does not exist, so sign up
        if(userData.error) {
          userData = await signupUser({username: name, email, password});
        }
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
