// Credit Gerald Ezenagu, section.io for reusable form input guide
// https://www.section.io/engineering-education/how-to-create-a-reusable-react-form/

import { useReducer, useEffect } from "react";

export default function Input({ id, name, element, label, type, placeholder, updateForm }) {
  const [inputState, dispatch] = useReducer(inputReducer, { value: "" });

  const handleChange = (event) => {
    dispatch({ type: "CHANGE", value: event.target.value });
  } 

  const inputElement = element === "input" ? (
    <input id={id} name={name} type={type} placeholder={placeholder} value={inputState.value}
    onChange={handleChange} />
  ) : (
    <textarea name={name} rows="4" onChange={handleChange} value={inputState.value} />
  );

  // Update form state whenever the input state changes
  useEffect(() => {
    updateForm(id, inputState.value);
  }, [inputState.value, id, updateForm])

  return (
    <div className="">
      <label htmlFor={id}> {label} </label>
      {inputElement}
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
}