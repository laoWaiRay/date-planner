import "./UpcomingCard.css";
import Card from "react-bootstrap/Card";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  let formattedHours = parseInt(hours) % 12;
  formattedHours = formattedHours === 0 ? 12 : formattedHours;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const ampm = parseInt(hours) >= 12 ? "pm" : "am";

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().substr(-2);

  return `${day} ${month}, ${year}`;
};

function UpcomingCard({
  eventId,
  invitationId,
  loggedInUsername,
  senderUsername,
  receiverUsername,
  senderAvatarUrl,
  receiverAvatarUrl,
  invitationStartTime,
  invitationDate,
  eventTitle,
  eventDetailedAddress,
  eventCity,
  eventCountry,
}) {
  const navigate = useNavigate();
  const handleClick = (id) => {
    console.log(id);
    navigate(`/dates/${id}`);
  };

  return (
    <Card className="card-container">
      <Card.Body>
        <Card.Title className="text-center">{eventTitle}</Card.Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                alt={senderUsername}
                sx={{ width: 24, height: 24, marginTop: "-30px" }}
                src={senderAvatarUrl}
              />
            }
          >
            <Avatar alt="Date Partner Avatar" src={receiverAvatarUrl} />
          </Badge>
          <div className="ml-3">
            <span>
              <b>
                {/* 
                  The logged in user can either be the sender or the receiver
                  for the upcoming date 
                */}
                <i>Date with {' '}
                  {
                    senderUsername == loggedInUsername ? 
                    receiverUsername : 
                    senderUsername
                  }
                </i>
              </b>
            </span>
            <div>
              <b>When:</b> {formatTime(invitationStartTime)},{" "}
              {formatDate(invitationDate)}.
            </div>
            <div>
              <b>Where:</b> {eventDetailedAddress}, {eventCity}, {eventCountry}
            </div>
            <div className="parent-container">
              <div className="left-corner">
                <Chip
                  color="secondary"
                  label="View Event"
                  onClick={() => handleClick(eventId)}
                />
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default UpcomingCard;
