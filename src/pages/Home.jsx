import { useAuthContext } from "../hooks/useAuthContext";
import useLogout from "../hooks/useLogout";
import "./Home.css";

import InvitationCard from "../components/InvitationCard";
import UpcomingCard from "../components/UpcomingCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Polaroid from "../components/Polaroid";
import Slider from "react-slick";
import { AddAPhoto } from "@mui/icons-material";
import { useState, useEffect } from "react";
import AvatarUploadModal from "../components/AvatarUploadModal";
const polaroids = [
  {
    imageSrc: "src/assets/Hero.jpg",
    caption: "Polaroid 1",
  },
  {
    imageSrc: "src/assets/Hero.jpg",
    caption: "Polaroid 2",
  },
];

export default function Home() {
  const { user } = useAuthContext();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);

  const logout = useLogout();
  console.log(user);

  const backgroundImage = "src/assets/Hero.jpg";
  const avatarImage = "src/assets/avatar.png";

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  const handleUploadBtnClick = () => {
    setUploadModalOpen(true);
  };

  useEffect(() => {
    console.log("here");
    console.log(user);

    if (user && user.id) {
      const fetchInvitations = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/pendingUserInvites?user_id=${user.id}`
          );
          const data = await response.json();
          console.log(data);
          setInvitations(data);
        } catch (error) {
          console.error("Error fetching invitations:", error.message);
        }
      };

      fetchInvitations();
    }
  }, [user]);

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
              <div className="relative">
                <img src={avatarImage} alt="Avatar" className="avatar" />
                <button
                  onClick={handleUploadBtnClick}
                  className="absolute bg-slate-300 -bottom-2 -right-4 p-[10px] rounded-full flex 
                  justify-center items-center hover:brightness-[98%] hover:-translate-y-[1px] duration-300"
                >
                  <AddAPhoto className="text-slate-800" />
                </button>
              </div>
              <div className="welcome-message">Welcome {user.username}</div>
            </div>
          </div>
        </div>
        <div className="floating-card-polariod">
          <Slider {...settings}>
            {polaroids.map((polaroid, index) => (
              <div key={index}>
                <Polaroid
                  imageSrc={polaroid.imageSrc}
                  caption={polaroid.caption}
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="cards-container-all">
          <div className="floating-card-invitations">
            <h2 className="text-center">INVITATIONS</h2>
            {invitations.length === 0 ? (
              <p>No pending invitations.</p>
            ) : (
              invitations.map((invitation, index) => (
                <InvitationCard
                  key={index}
                  eventId={invitation.event_id}
                  senderUsername={invitation.sender_username}
                  senderAvatarUrl={invitation.sender_avatar_url}
                  invitationStartTime={invitation.invitation_start_time}
                  invitationDate={invitation.invitation_date}
                  eventTitle={invitation.event_title}
                  eventDetailedAddress={invitation.event_detailed_address}
                  eventCity={invitation.event_city}
                  eventCountry={invitation.event_country}
                />
              ))
            )}
          </div>
          <div className="floating-card-upcoming">
            <h2 className="text-center">UPCOMING DATES</h2>
            <UpcomingCard />
            <UpcomingCard />
            <UpcomingCard />
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {uploadModalOpen && (
        <AvatarUploadModal
          onClose={() => setUploadModalOpen(false)}
          userId={user.id}
        />
      )}
    </>
  );
}
