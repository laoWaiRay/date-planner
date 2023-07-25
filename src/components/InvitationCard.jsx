import Card from "react-bootstrap/Card";
import CheckIcon from "@mui/icons-material/Check";
import Fab from "@mui/material/Fab";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";

import './InvitationCard.css'
function InvitationCard() {
    return ( 
        <Card className="card-container">
            <Card.Body>
              <Card.Title className="text-center">Beach Date</Card.Title>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt="Remy Sharp"
                  src="src/assets/avatar.png"
                  sx={{ width: 56, height: 56 }}
                />
                <div className="ml-2">
                  <span>
                    <b>
                      <i>Gurpreet invited you!</i>
                    </b>
                  </span>
                  <div>
                    <b>When:</b> 7:00 PM, July 30, 2023.
                  </div>
                  <div>
                    <b>Where:</b> Sunny Beach, Vancouver, Canada
                  </div>
                  <div className="parent-container">
                    <div className="left-corner">
                      <a>View Date</a>
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