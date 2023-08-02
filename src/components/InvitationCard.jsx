import React from "react";
import Card from "react-bootstrap/Card";
import CheckIcon from "@mui/icons-material/Check";
import Fab from "@mui/material/Fab";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import "./InvitationCard.css";
import { useNavigate } from "react-router-dom";
import {
  sendEventRejectionEmail,
  sendEventAcceptanceEmail,
} from "../api/internal/postgres";

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

function InvitationCard({
  invitationId,
  eventId,
  senderUsername,
  senderAvatarUrl,
  invitationStartTime,
  invitationDate,
  eventTitle,
  eventDetailedAddress,
  eventCity,
  eventCountry,
  updateInvitationStatus,
}) {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/dates/${id}`);
  };

  return (
    <Card className="card-container" >
      <Card.Body>
        <Card.Title className="text-center"> {eventTitle}</Card.Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={senderAvatarUrl}
            alt={senderUsername}
            sx={{ width: 56, height: 56, marginTop: "-30px" }}
          />
          <div className="ml-2">
            <span>
              <b>
                <i>{senderUsername} invited you!</i>
              </b>
            </span>
            <div>
              <b>When:</b> {formatTime(invitationStartTime)},{" "}
              {formatDate(invitationDate)}.
            </div>
            <div>
              <b>Where:</b> {eventDetailedAddress}, {eventCity}, {eventCountry}
            </div>
          </div>
        </div>
        <div className="parent-container">
          <div className="left-corner">
            <Chip
              label="View Event"
              onClick={() => handleClick(eventId)}
              sx={{
                backgroundColor: "#39798f",
                color: "white",
                ":hover": { bgcolor: "#1d3d48" },
              }}
            />
          </div>
          <div className="right-corner">
            <Fab
              size="small"
              color="success"
              aria-label="confirm"
              style={{
                marginLeft: "-10%",
                marginRight: "10%",
              }}
            >
              <CheckIcon
                onClick={() => {
                  updateInvitationStatus(invitationId, "accepted");
                  sendEventAcceptanceEmail(invitationId);
                }}
              />
            </Fab>
            <Fab size="small" color="error" aria-label="decline">
              <CloseIcon
                onClick={() => {
                  updateInvitationStatus(invitationId, "rejected");
                  sendEventRejectionEmail(invitationId);
                }}
              />
            </Fab>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default InvitationCard;
