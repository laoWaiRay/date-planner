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
        <Card variant="outlined" sx={{ maxWidth: 250 }}>
            <CardMedia
                sx={{ height: 180 }}
                image= {image ? image: Hero}
            />
            <CardContent>
                <h1 className="text-xl font-medium">{name}</h1>
                <p className="text-sm text-slate-500">Location: {location}</p>
                <p className="text-sm text-slate-500">Category: {category}</p>
                <p className="text-sm">{description}</p>
            </CardContent>
            <CardActions>
                <Button size="small">Test</Button>
                <IconButton color="default"><FavoriteBorderIcon></FavoriteBorderIcon></IconButton>
            </CardActions>
        </Card>
    )
}