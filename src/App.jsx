import React, { useEffect } from 'react'
import { 
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import Home from './pages/Home'
import Login, { loader as loginLoader } from './pages/Login'
import ErrorPage from './pages/ErrorPage'
import Signup from './pages/Signup'
import RequireAuth from './pages/RequireAuth'

export default function App() {
  return (
      <RouterProvider router={router} />
  )
}

// React Router
const router = createBrowserRouter([
  {
    path: '/',
    element: (
        <RequireAuth>
          <Home />
        </RequireAuth>
      ),
    errorElement: <ErrorPage />
  },
  {
    path: 'login',
    element: <Login />,
    loader: loginLoader
  },
  {
    path: 'signup',
    element: <Signup />,
    loader: loginLoader
  }
])
