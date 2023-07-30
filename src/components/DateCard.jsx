import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import CreateDateInvite from "./DateInviteModal"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDefaultImage } from '../helpers/getDefaultImage';
import { Rating } from '@mui/material';
import { getAverageReviewScore } from '../api/internal/postgres';
import { red } from '@mui/material/colors';
import { useAuthContext } from '../hooks/useAuthContext';

const isAPIevt = (id) => {
  return id.length > 10;
}

export default function DateCard({ id, name, description, category, location, 
  retrieveFavorites, image, price, inFavorite, isticketmaster=false }) {
    const { user } = useAuthContext();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isAPIEvent] = useState(isAPIevt(id));
    const [averageScore, setAverageScore] = useState(0.0);
    const [isFav, setIsFav] = useState(inFavorite);
    const navigate = useNavigate();
    const eventid = id

    useEffect(() => {
      if (isAPIEvent) return;
      (async () => {
        let avgScore = parseFloat((await getAverageReviewScore(id)).avg).toFixed(1);
        if (avgScore == "NaN")
          avgScore = 0.0;
        setAverageScore(parseFloat(avgScore));
      })()
    }, [])

    const toggleIsFav = () => {
      if(isFav == false) {
        setIsFav(true)
      } else {
        setIsFav(false)
      }
    }
    
    const handleInviteClick = () => {
        setShowInviteModal(true);
      };

    const handleCloseModal = () => {
      setShowInviteModal(false);
    };

    const handleClickDetails = () => {
      navigate(`/dates/${id}`);
    }

    const handleFavoriteClick = async () => {
      if (isFav == false) {
        let url = `http://localhost:8000/favorites?user=${user.id}&event=${eventid}`
        fetch(url, {
          method: "POST"
        })
        .then((response) => {
            return response.json()
        })
        .catch (error => {
            console.log(error)
        })
        console.log("SETTING FAV")
        toggleIsFav()
        console.log(isFav)
      }
    }

    const handleUnfavoriteClick = () => {
      if (isFav == true) {
        let url = `http://localhost:8000/favorites?user=${user.id}&event=${eventid}`
        fetch(url, {
          method: "DELETE"
        })
        .then((response) => {
          retrieveFavorites();
          return response.json()
        })
        .catch (error => {
            console.log(error)
        })
        console.log("REMOVE FAV")
        toggleIsFav()
        console.log(isFav)
      }
    }

    
    return (
        <Card className="h-full flex flex-col bg-red-200" variant="outlined" sx={{ maxWidth: 350}}>
            <CardMedia
                sx={{ height: 180 }}
                image={image ? image : getDefaultImage(category)}
                className='min-h-[180px]'
            />
            <CardContent className="py-2 px-3">
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
                {price ? <p className="text-sm text-slate-500 my-2">Price: {price}</p>:<></>}
                { description !== undefined ? <p className="text-sm">{description}</p>: null}
            </CardContent>
            
            <CardActions className='mt-auto px-3'>
                <Button onClick={handleClickDetails} size="small" variant="contained" sx={{backgroundColor: "#39798f", ':hover': {bgcolor: '#1d3d48'}}}>Details</Button>
                <Button onClick={handleInviteClick} size="small" variant="contained" sx={{backgroundColor: "#39798f", ':hover': {bgcolor: '#1d3d48'}}}>Invite</Button>
                <div>
                {isticketmaster === true 
                  ? null :
                  <div>
                  {isFav === false ? 
                    <><IconButton className="mx-2" color="default" onClick={handleFavoriteClick}><FavoriteBorderIcon></FavoriteBorderIcon></IconButton></>:
                    <><IconButton className="mx-2" onClick={handleUnfavoriteClick}><FavoriteIcon sx={{ color: red[700] }}></FavoriteIcon></IconButton></>
                  }
                  </div>
                }
                </div>
            </CardActions>

            {showInviteModal && (<CreateDateInvite onClose={handleCloseModal} eventID={id}/>)}
        </Card>
    )
}
