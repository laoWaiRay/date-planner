import { createContext, useReducer, useEffect } from 'react'

const AuthContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload, isLoaded: true };
    case "LOGOUT":
      return { user: null, isLoaded: true };
    default:
      return state;
  }
}

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoaded: false
  });

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthContextProvider }