import Card from "react-bootstrap/Card";
import CheckIcon from "@mui/icons-material/Check";
import Fab from "@mui/material/Fab";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import "./InvitationCard.css";
function InvitationCard({
  senderUsername,
  senderAvatarUrl,
  invitationStartTime,
  invitationDate,
  eventTitle,
  eventDetailedAddress,
  eventCity,
  eventCountry,
}) {
  return (
    <Card className="card-container">
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
              <b>When:</b> {invitationStartTime}, {invitationDate}.
            </div>
            <div>
              <b>Where:</b> {eventDetailedAddress}, {eventCity}, {eventCountry}
            </div>
            <div className="parent-container">
              <div className="left-corner">
                <Chip label="View Event" color="secondary" />
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
                  <CheckIcon />
                </Fab>
                <Fab size="small" color="error" aria-label="decline">
                  <CloseIcon />
                </Fab>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default InvitationCard;
