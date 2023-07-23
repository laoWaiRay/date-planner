import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import CreateDateInvite from "./DateInviteModal"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDefaultImage } from '../helpers/getDefaultImage';
import { Rating } from '@mui/material';
import { getAverageReviewScore } from '../api/internal/postgres';

const isAPIevt = (id) => {
  return id.length > 10;
}

export default function DateCard({ id, name, description, category, location, image, price }) {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isAPIEvent] = useState(isAPIevt(id));
    const [averageScore, setAverageScore] = useState(0.0);
    const navigate = useNavigate();

    const handleInviteClick = () => {
        setShowInviteModal(true);
      };

    const handleCloseModal = () => {
      setShowInviteModal(false);
    };

    const handleClickDetails = () => {
      console.log("NAVIGATE TO ID: ", id)
      navigate(`/dates/${id}`);
    }

    useEffect(() => {
      if (isAPIEvent) return;

      (async () => {
        let avgScore = parseFloat((await getAverageReviewScore(id)).avg).toFixed(1);
        if (avgScore == "NaN")
          avgScore = 0.0;
        setAverageScore(parseFloat(avgScore));
      })()
    }, [])
    
    return (
        <Card className="h-full flex flex-col bg-red-200" variant="outlined" sx={{ maxWidth: 350 }}>
            <CardMedia
                sx={{ height: 180 }}
                image={image ? image : getDefaultImage(category)}
                className='min-h-[180px]'
            />
            <CardContent>
                <h1 className="text-base font-medium m-0">{name}</h1>

                {/* Star rating */}
                {
                  (averageScore != 0.0) ? (
                    <div className="flex items-center space-x-2">
                      <Rating 
                        value={averageScore}
                        readOnly
                        precision={0.1}
                      />
                      <span className="text-lg font-semibold">{averageScore}</span>
                    </div>
                  ) : (
                    <div className={isAPIEvent ? "hidden" : ""}>No Ratings</div>
                  )
                }
                

                <p className="text-sm text-slate-500 my-0">Location: {location}</p>
                <p className="text-sm text-slate-500 my-0">Category: <span style={{textTransform:'capitalize'}}>{category}</span></p>
                {price ? <p className="text-sm text-slate-500 my-0">Price: {price}</p>:<></>}
                <p className="text-sm">{description}</p>
            </CardContent>
            
            <CardActions className='mt-auto'>
                <Button onClick={handleClickDetails}>Details</Button>
                <Button onClick={handleInviteClick} size="small">Invite</Button>
                <IconButton color="default"><FavoriteBorderIcon></FavoriteBorderIcon></IconButton>
            </CardActions>

            {showInviteModal && (<CreateDateInvite onClose={handleCloseModal} eventID={id}/>)}
        </Card>
    )
}
