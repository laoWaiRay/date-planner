import { useAuthContext } from "../hooks/useAuthContext"
import useLogout from "../hooks/useLogout";

export default function Home() {
  const { user } = useAuthContext();
  const logout = useLogout();

  return (
    <>
      <h1 className='text-blue-600 text-4xl font-display font-semibold italic'>Date Planner</h1>
      {user &&
        <>
          <div>Welcome back {user.username}!</div>
          <button className="border-black border p-1" onClick={logout}>Logout</button>
        </>
      }
    </>
  )
}