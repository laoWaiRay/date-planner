import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Hero from "../assets/Hero.jpg"
import CreateDateInvite from "./DateInviteModal"
import { useState } from 'react';


export default function DateCard({ id, name, description, category, location, image, price }) {

    const [showInviteModal, setShowInviteModal] = useState(false);

    const handleInviteClick = () => {
        setShowInviteModal(true);
      };

      const handleCloseModal = () => {
        setShowInviteModal(false);
      };
    
    return (
        <Card variant="outlined" sx={{ maxWidth: 250 }}>
            <CardMedia
                sx={{ height: 180 }}
                image= {image ? image: Hero}
            />
            <CardContent>
                <h1 className="text-xl font-medium">{name}</h1>
                <p className="text-sm text-slate-500 my-0">Location: {location}</p>
                <p className="text-sm text-slate-500 my-0">Category: <span style={{textTransform:'capitalize'}}>{category}</span></p>
                {price ? <p className="text-sm text-slate-500 my-0">Price: {price}</p>:<></>}
                <p className="text-sm">{description}</p>
            </CardContent>
            <CardActions>
                <Button onClick={handleInviteClick} size="small">Invite</Button>
                <IconButton color="default"><FavoriteBorderIcon></FavoriteBorderIcon></IconButton>
            </CardActions>

            {showInviteModal && (<CreateDateInvite onClose={handleCloseModal} eventID={id}/>)}
        </Card>
    )
}
