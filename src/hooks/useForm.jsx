import { useReducer, useCallback } from "react"

export default function useForm({ initialValues }) {
  const [formState, dispatch] = useReducer(formReducer, initialValues);

  // Memoize function to avoid infinite looping when calling it inside useEffect 
  // (function references change on each rerender otherwise)
  const handleInputChange = useCallback((inputId, inputValue) => {
    dispatch({ type: "CHANGE", inputId, inputValue})
  }, []);

  return [formState, handleInputChange];
}

const formReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.inputId]: action.inputValue };
    default:
      return state;
  }
}