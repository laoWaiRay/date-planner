import "./UpcomingCard.css";
import Card from "react-bootstrap/Card";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';


function UpcomingCard() {
  return (
    <Card className="card-container">
      <Card.Body>
        <Card.Title className="text-center">Beach Date</Card.Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar alt="Remy Sharp"  sx={{ width: 24, height: 24 }} src="src/assets/avatar.png" />
            }
          >
            <Avatar alt="Travis Howard"    src="src/assets/avatar.png" />
          </Badge>
          <div className="ml-3">
            <span>
              <b>
                <i>Date with Gurpreet</i>
              </b>
            </span>
            <div>
              <b>When:</b> 7:00 PM, July 30, 2023.
            </div>
            <div>
              <b>Where:</b> Sunny Beach, Vancouver, Canada
            </div>
            <div className="parent-container">
              <div className="left-corner" >
                <a>View Date</a>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default UpcomingCard;
