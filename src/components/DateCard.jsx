import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Hero from "../assets/Hero.jpg"

export default function DateCard({ name, description, category, location, image }) {
    
    return (
        <Card className="h-full flex flex-col bg-red-200" variant="outlined" sx={{ maxWidth: 250, maxHeight: 400 }}>
            <CardMedia
                sx={{ height: 180 }}
                image= {image ? image: Hero}
            />
            <CardContent>
                <h1 className="text-base font-medium m-0 mb-2">{name}</h1>
                <p className="text-sm text-slate-500 m-0 mb-2">Location: {location}</p>
                <p className="text-sm text-slate-500 m-0 mb-2">Category: {category}</p>
                <p className="text-sm">{description}</p>
            </CardContent>
            <CardActions className='mt-auto'>
                <Button size="small">VIEW</Button>
                <IconButton color="default"><FavoriteBorderIcon></FavoriteBorderIcon></IconButton>
            </CardActions>
        </Card>
    )
}
