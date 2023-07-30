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
import { useNavigate } from "react-router-dom";
import date3  from "../assets/homepage/date3.jpg"
import date1 from "../assets/homepage/date1.jpg"
import date2 from "../assets/homepage/date2.jpg"
import date4 from "../assets/homepage/date4.jpg"
import date5 from "../assets/homepage/date5.jpg"
import date6 from "../assets/homepage/date6.jpg"
import date7 from "../assets/homepage/date7.jpg"
import date8 from "../assets/homepage/date8.jpg"
 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

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

  const navigate = useNavigate();
  const logout = useLogout();

  const backgroundImage = user.cover_photo || "src/assets/homepage/background6.jpg";
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

  const handleNavCardClick = (event, navItem) => {
    switch (navItem) {
      case "add":
        navigate("/dates/new");
        break;
      case "public":
        navigate("/dates");
        break;
      case "mydates":
        navigate("/mydates");
        break;
      case "favorites":
        navigate("/favorites");
        break;
      case "events":
        navigate("/events");
        break;
      default:
        return () => {};
    }
  };

  const navigationCard = (link, cardImage, title, message) => {
    return (
      <>
        <Card>
          <CardActionArea onClick={(e) => handleNavCardClick(e, link)}>
            <CardMedia
              component="img"
              height="140"
              image={cardImage}
            />

            <CardContent>
              <Typography gutterBottom variant="h5" component="div" > { title } </Typography>
              <Typography 
                variant="body2" 
                className="text-gray-600 !font-light"
              > 
                { message[0].toUpperCase() + message.toLowerCase().slice(1) } 
              </Typography>
            </CardContent>

          </CardActionArea>
        </Card>
      </>
    )

  }

  return (
    <>
      <div className="homepage-container">
        <div id="background-image-container">
          <img
            src={backgroundImage}
            alt="Background"
            className={`background-image ${user.cover_photo ? "!object-center" : ""}`}
          />
          <div className="avatar-overlay">
            <div className="avatar-container">
              <div className="relative">
                <img src={avatarImage} alt="Avatar" className="avatar object-cover" />
                <button
                  onClick={handleUploadBtnClick}
                  className="absolute bg-slate-300 -bottom-2 -right-4 p-[10px] rounded-full flex 
                  justify-center items-center hover:brightness-[98%] hover:-translate-y-[1px] duration-300"
                >
                  <AddAPhoto className="text-slate-800" />
                </button>
              </div>
              <div 
                className="welcome-message mt-2
                drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
              >
                Welcome back, {user.username}!
              </div>
            </div>
          </div>
        </div>
        
        {/* Container for invitation, link, upcoming tables */}
        <div className ="flex bgColor">
            <div className="floating-card-invitations my-5 max-h-[100vh] overflow-y-auto !space-y-4">
              <h2 
                className="text-center font-light tracking-wider pb-2 mb-4 border-b"
                style= {{color: "#39798f"}}
              >
                INVITATIONS
              </h2>
              {invitations.length === 0 ? (
                <p className="text-center text-gray-600 !font-light">No pending invitations</p>
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
          
          {/* Navigation Links Table */}
          <div className="grid container gap-2  mx-auto my-5">
            {/* Top row of Navigation Links table*/}
            <div className="grid grid-cols-3 gap-3">
              {/* Favorites Card */}
                {navigationCard("favorites", date1, "Favorites", "CHECK OUT YOUR FAVORITE DATE IDEAS")}

              {/* Explore Dates Card */}
                {navigationCard("public", date3, "Explore Dates", "FIND INSPIRATION FOR YOUR NEXT HANG OUT")}

              
              {/* Your Date Ideas Card */}
                {navigationCard("mydates", date2, "Your Date Ideas", "REVIEW THE IDEAS YOU HAVE COME UP WITH")}
            </div>

            {/* Bottom row of Navigation Links table*/}
            <div className="grid grid-cols-2 gap-3 mx-auto">
              {/* Add Dates Card */}
                {navigationCard("add", date5, "Add Date Ideas", "SAVE YOUR UNIQUE DATE IDEAS AND SHARE THEM WITH OTHERS")}

              {/* Events & Concerts Card */}
                {navigationCard("events", date6, "Events & Concerts", "FIND LOCAL EVENTS AND CONCERTS HAPPENING IN YOUR AREA")}

            </div>
          </div>
            
          {/* Upcoming Dates Table */}
            <div className="floating-card-upcoming my-5 max-h-[100vh] overflow-y-auto !space-y-4">
              <h2 
                className="text-center font-light tracking-wider pb-2 mb-4 border-b"
                style= {{color: "#39798f"}}
              >
                UPCOMING
              </h2>
                {upcomingInvitations.length === 0 ? (
                  <p className="text-center text-gray-600 !font-light">No upcoming dates</p>
                ) : (
                  upcomingInvitations.map((upcomingInvitation, index) => (
                    <UpcomingCard
                      key={index}
                      eventId={upcomingInvitation.event_id}
                      invitationId={upcomingInvitation.invitation_id}
                      loggedInUsername={user.username}
                      senderUsername={upcomingInvitation.sender_username}
                      receiverUsername={upcomingInvitation.receiver_username}
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

        <div className="grid grid-cols-4 gap-5 max-w-5xl mx-auto">
          <p>Test</p>
          <p>TETESTTESTSETSETSET</p>
          {/* <>{displayCards()}</> */}
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
