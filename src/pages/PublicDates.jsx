import DateCard from "../components/DateCard";
import Pagination from '@mui/material/Pagination';
import { useState, useEffect } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function PublicDates() {
    const [dates, setDates] = useState([]);
    const [events, setEvents] = useState([]);

    // For filtering
    const [categorySelect, setCategorySelect] = useState("all");
    const [priceSelect, setPriceSelect] = useState("all");

    // For pagination viewing
    const [tabValue, setTabValue] = useState("0");
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(4);
    const lastCardIndex =  currentPage * cardsPerPage
    const firstCardIndex = lastCardIndex - cardsPerPage
    const totalDatePageCount = Math.ceil(dates.length/cardsPerPage)
    const totalEventPageCount = Math.ceil(events.length/cardsPerPage)

    useEffect(() => {
        retrieveEvents();
        retrieveDates();
    }, []);

    useEffect(() => {
        retrieveDates();
      }, [categorySelect, priceSelect]);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const retrieveEvents = () => {
        let url = `http://localhost:8000/ticketmaster`
        fetch(url)
        .then((response) => {
            return response.json()
          }) 
          .then((data) => {
            setEvents(data)
          })
        .catch (error => {
            console.log(error)
        })
    }

    const retrieveDates = () => {
        if (categorySelect == "all" && priceSelect == "all") {
            var url = `http://localhost:8000/mydates`
        } else {
            var url = `http://localhost:8000/mydates?category=${categorySelect}&price=${priceSelect}`
        }
        
        fetch(url)
        .then((response) => {
            return response.json()
          }) 
          .then((data) => {
            setDates(data)
          })
        .catch (error => {
            console.log(error)
        })
    }

    const displayEvents = (() => 
        events.slice(firstCardIndex, lastCardIndex).map(function(event) {
            var name = event.name
            var description = event.info
            var category = event.classifications[0].genre.name
            var location = event._embedded.venues[0].name
            var event_id = event.id

            if (event.images[1]) {
                var image = event.images[1].url
            } else {
                var image = event.images[0].url
            }

            return (
                <DateCard key={event_id} name={name} category={category} location={location} image={image}></DateCard>
            )
            
        })
    )
    
    const displayDates = (() => 
        dates.slice(firstCardIndex, lastCardIndex).map(function(date) {
            let name = date.title
            let description = date.description
            let category = date.category;
            let location = date.city
            let price = date.price
            let id = date.id

            return (
                <DateCard key={id} name={name} category={category} location={location} price={price}></DateCard>
            )
        })
    )

    const onPageChange = ((evt, page) => {
        setCurrentPage(page)
    })

    const onCategorySelect = (event, value)  =>{
        let category = value.props.value
        setCategorySelect(category)
    }

    const onPriceSelect = (event, value)  =>{
        setPriceSelect(value.props.value)
    }

    const FilterBar = () => {

        return (
            <>
                <FormControl sx={{ mx: 2, minWidth: 160 }}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={categorySelect}
                        label="Category"
                        onChange={onCategorySelect}
                    >   
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="romantic">Romantic</MenuItem>
                        <MenuItem value="indoor">Indoors</MenuItem>
                        <MenuItem value="adventurous">Adventurous</MenuItem>
                        <MenuItem value="relaxing">Relaxing</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ mx: 2, minWidth: 140 }}>
                    <InputLabel id="price-select-label">Price</InputLabel>
                    <Select
                        labelId="price-select-label"
                        id="price-select"
                        value={priceSelect}
                        label="Price"
                        onChange={onPriceSelect}
                    >   
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="Free">Free</MenuItem>
                        <MenuItem value="$">$</MenuItem>
                        <MenuItem value="$$">$$</MenuItem>
                        <MenuItem value="$$$">$$$</MenuItem>
                        <MenuItem value="$$$$">$$$$</MenuItem>
                    </Select>
                </FormControl>
            </>
        )

    }

    return (
        <>
          <h1 className="font-display text-blue-500 font-bold text-4xl text-center mb-0 -mt-2">Find Date Ideas</h1>
          <Tabs className="mb-2" value ={tabValue} onChange={handleChange} centered>
              <Tab value="0" label="Shared by Users" />
              <Tab value="1" label="Events/Concerts" />
          </Tabs>
          <div className="flex">
              <div className="mx-auto my-2">
                  {tabValue == "0" ?<>{FilterBar()} </>: <></>}
              </div>
          </div>
          <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
              {tabValue == "0" ? <>{displayDates()}</>: <>{displayEvents()}</>}
          </div>
          <div className="flex">
              {tabValue == "0" ?
                  <><Pagination className="mx-auto my-4" page={currentPage} count={totalDatePageCount} color="primary" onChange={onPageChange} /></>:
                  <><Pagination className="mx-auto my-4" page={currentPage} count={totalEventPageCount} color="primary" onChange={onPageChange} /></>
              }  
          </div>
        </>
    )
  }