import { useAuthContext } from "../hooks/useAuthContext";
import useLogout from "../hooks/useLogout";
import "./Home.css";

import InvitationCard from '../components/InvitationCard';
import UpcomingCard from '../components/UpcomingCard';

export default function Home() {
  const { user } = useAuthContext();

  const logout = useLogout();

  const backgroundImage = "src/assets/Hero.jpg"; // Update image path
  const avatarImage = "src/assets/avatar.png"; // Update image path
  const username = "Gurpreet Sethi";

  return (
    <>
      <div className="homepage-container">
        <div className="background-image-container">
          <img
            src={backgroundImage}
            alt="Background"
            className="background-image"
          />
          <div className="avatar-overlay">
            <div className="avatar-container">
              <img src={avatarImage} alt="Avatar" className="avatar" />
              <div className="welcome-message">Welcome {username}</div>
            </div>
          </div>
        </div>
        <div className="floating-card-invitations">
          <h2 className="text-center">INVITATIONS</h2>
          <InvitationCard/>
          <InvitationCard/>
        </div>
        <div className="floating-card-upcoming">
          <h2 className="text-center">UPCOMING DATES</h2>
          <UpcomingCard />
           <UpcomingCard />
            <UpcomingCard />
        </div>
      </div>
    </>
  );
}
