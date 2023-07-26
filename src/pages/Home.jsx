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
import { useState } from "react";
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
            <InvitationCard />
            <InvitationCard />
            <InvitationCard />
            <InvitationCard />
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
