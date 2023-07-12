import { useAuthContext} from "../hooks/useAuthContext"
import useLogout from "../hooks/useLogout";
import DateForm from "../components/dateform";
import { useState } from "react";
import Button from 'react-bootstrap/Button';


  

export default function Home() {
  const { user } = useAuthContext();
  //For date form 
  const [modalShow, setModalShow] = useState(false);

  const logout = useLogout();

  return (
    <>
      <h1 className='text-blue-600 text-4xl font-display font-semibold italic'>Date Planner</h1>
       <Button variant="primary" onClick={() => setModalShow(true)}>
        Dateform
      </Button>

      <DateForm
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {user &&
        <>
          <div>Welcome back {user.username}!</div>
          <button className="border-black border p-1" onClick={logout}>Logout</button>
        </>
      }
    </>
  )
}