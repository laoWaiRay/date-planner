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
  const [upcomingInvitations, setUpcomingInvitations] = useState([]);

  const logout = useLogout();
  console.log(user);

  const backgroundImage = user.cover_photo || "src/assets/Hero.jpg";
  const avatarImage = user.avatar || "src/assets/avatar.png";

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

  const fetchInvitations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/pendingUserInvites?user_id=${user.id}`
      );
      const data = await response.json();
      console.log("Fetched invitations:", data);
      setInvitations(data);
    } catch (error) {
      console.error("Error fetching invitations:", error.message);
    }
  };

  const fetchUpcomingInvitations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/upcomingUserInvites?user_id=${user.id}`
      );
      const data = await response.json();
      console.log("Fetched upcoming invitations:", data);
      setUpcomingInvitations(data);
    } catch (error) {
      console.error("Error fetching  upcoming invitations:", error.message);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchInvitations();
      fetchUpcomingInvitations();
    }
  }, [user]);

  const updateInviteStatus = async (inviteId, newStatus) => {
    const url = `http://localhost:8000/updateInviteStatus?invite_id=${inviteId}&status=${newStatus}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        fetchInvitations();
        fetchUpcomingInvitations();
      } else {
        console.error("Failed to update invitation status.");
      }
    } catch (error) {
      console.error("Error updating invitation status:", error.message);
    }
  };

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
                  invitationId={invitation.invitation_id}
                  eventId={invitation.event_id}
                  senderUsername={invitation.sender_username}
                  senderAvatarUrl={invitation.sender_avatar_url}
                  invitationStartTime={invitation.invitation_start_time}
                  invitationDate={invitation.invitation_date}
                  eventTitle={invitation.event_title}
                  eventDetailedAddress={invitation.event_detailed_address}
                  eventCity={invitation.event_city}
                  eventCountry={invitation.event_country}
                  updateInvitationStatus={updateInviteStatus}
                />
              ))
            )}
          </div>
          <div className="floating-card-upcoming">
            <h2 className="text-center">UPCOMING DATES</h2>
            {upcomingInvitations.length === 0 ? (
              <p>No upcoming dates.</p>
            ) : (
              upcomingInvitations.map((upcomingInvitation, index) => (
                <UpcomingCard
                  key={index}
                  eventId={upcomingInvitation.event_id}
                  invitationId={upcomingInvitation.invitation_id}
                  senderUsername={upcomingInvitation.sender_username}
                  senderAvatarUrl={upcomingInvitation.sender_avatar_url}
                  receiverAvatarUrl={upcomingInvitation.receiver_avatar_url}
                  invitationStartTime={upcomingInvitation.invitation_start_time}
                  invitationDate={upcomingInvitation.invitation_date}
                  eventTitle={upcomingInvitation.event_title}
                  eventDetailedAddress={
                    upcomingInvitation.event_detailed_address
                  }
                  eventCity={upcomingInvitation.event_city}
                  eventCountry={upcomingInvitation.event_country}
                />
              ))
            )}
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
