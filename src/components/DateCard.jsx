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

export default function DateCard({ id, name, description, category, location, image, price, favorites, inFavorite }) {
    const { user } = useAuthContext();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isAPIEvent] = useState(isAPIevt(id));
    const [averageScore, setAverageScore] = useState(0.0);
    // const [isFav, setIsFav] = useState(inFavorite);
    const navigate = useNavigate();
    const eventid = id
    var isFav = inFavorite

    console.log(eventid,isFav, inFavorite)

    useEffect(() => {
      // setIsFav(initFav)
      // checkFavorites()
      if (isAPIEvent) return;
      (async () => {
        let avgScore = parseFloat((await getAverageReviewScore(id)).avg).toFixed(1);
        if (avgScore == "NaN")
          avgScore = 0.0;
        setAverageScore(parseFloat(avgScore));
      })()
    }, [])
    

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

    const setIsFav = () => {
      if(isFav == false) {
        isFav = true
        // setIsFav(true)
      } else {
        isFav = false
        // setIsFav(false)
      }
    }

    const handleFavoriteClick = () => {
      if (isFav ==  false) {
        let url = `http://localhost:8000/favorites?user=${user.id}&event=${eventid}`
        fetch(url, {
          method: "POST"
        })
        .then((response) => {
          console.log("SET FAV")

            return response.json()
        })
        .catch (error => {
            console.log(error)
        })
       setIsFav() 
      }
    }

    const handleUnfavoriteClick = () => {
      if (isFav == true) {
        let url = `http://localhost:8000/favorites?user=${user.id}&event=${eventid}`
        fetch(url, {
          method: "DELETE"
        })
        .then((response) => {
          return response.json()
        })
        .catch (error => {
            console.log(error)
        })
        setIsFav() 
      }
    }

    
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
                {isFav == false ? 
                  <IconButton color="default" onClick={handleFavoriteClick}><FavoriteBorderIcon></FavoriteBorderIcon></IconButton>:
                  <IconButton onClick={handleUnfavoriteClick}><FavoriteIcon sx={{ color: red[700] }}></FavoriteIcon></IconButton>
                }
            </CardActions>

            {showInviteModal && (<CreateDateInvite onClose={handleCloseModal} eventID={id}/>)}
        </Card>
    )
}
