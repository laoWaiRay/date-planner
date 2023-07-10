// Credit Gerald Ezenagu, section.io for reusable form input guide
// https://www.section.io/engineering-education/how-to-create-a-reusable-react-form/

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useReducer, useEffect, useState, useRef } from "react";

export default function Input({ id, name, element, label, type, placeholder, updateForm, errorMessage }) {
  const [inputState, dispatch] = useReducer(inputReducer, { value: "" });
  const inputRef = useRef(null);
  const [isVisibile, setVisibile] = useState(false);

  const handleChange = (event) => {
    dispatch({ type: "CHANGE", value: event.target.value });
  }

  const inputElement = element === "input" ? (
    <input id={id} name={name} type={type} placeholder={placeholder} value={inputState.value}
    onChange={handleChange} ref={inputRef}
    className="bg-gray-100 py-2 px-3 rounded-sm placeholder:text-gray-400 w-full" />
  ) : (
    <textarea name={name} rows="4" onChange={handleChange} value={inputState.value} />
  );

  const toggleVisiblility = () => {
    if (inputRef.current.type === "password")
      inputRef.current.type = "text";
    else
      inputRef.current.type = "password";
    
    setVisibile(!isVisibile);
  }

  // Update form state whenever the input state changes
  useEffect(() => {
    updateForm(id, inputState.value);
  }, [inputState.value, id, updateForm])

  return (
    <div className="flex flex-col">
      <label className={`text-sm pl-3 pb-2 ${errorMessage && 'text-red-500'}`} htmlFor={id}> 
        {label} {errorMessage && ` - ${errorMessage}`}
      </label>
      <div className="relative w-full">
        {inputElement}
        {(id === "password" || id === "confirmPassword") && 
          <button type="button" className="absolute right-3 top-2 text-gray-500"
          onClick={toggleVisiblility}>
            {isVisibile ? <VisibilityOff /> : <Visibility />}
          </button>
        }
      </div>
    </div>
  )
}

// Reducer function
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, value: action.value };
    default:
      return state;
  }
}

// Default props
Input.defaultProps = {
  element: "input",
  type: "text",
  errorMessage: ""
}