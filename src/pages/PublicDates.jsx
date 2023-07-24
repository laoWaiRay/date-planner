import DateCard from "../components/DateCard";
import Pagination from '@mui/material/Pagination';
import { useState, useEffect } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Outlet, useOutlet } from "react-router-dom";


export default function PublicDates() {
    const [dates, setDates] = useState([]);
    const [events, setEvents] = useState([]);
    const outlet = useOutlet();

    // For date idea filtering
    const [categorySelect, setCategorySelect] = useState("all");
    const [priceSelect, setPriceSelect] = useState("all");

    // For ticketmaster event filtering
    const dateObj = new Date()
    var currDay = dateObj.getDate()
    if (currDay < 10) {
        currDay = "0"+currDay
      }
    
    var currMonth = dateObj.getMonth()+1
    if (currMonth < 10) {
    currMonth = "0"+currMonth
    }
    var currYear = dateObj.getFullYear()
    var currentDate = currYear+"-"+currMonth+"-"+currDay
    const [eventStart, setEventStart] = useState(currentDate)
    const [eventEnd, setEventEnd] = useState(currentDate)
    const [countryCode, setCountryCode] = useState("CA")
    const [citySearch, setCitySearch] = useState("")
    const [eventInfo, setEventInfo] = useState({start: eventStart, end: eventEnd, city: citySearch, country: countryCode})

    // For pagination viewing
    const [tabValue, setTabValue] = useState("0");
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(12);
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
      }, [categorySelect, priceSelect, outlet]);

    // useEffect(() => {
    //     retrieveEvents();
    // }, [eventStart, eventEnd]);

    // useEffect(() => {
    //     retrieveEvents();
    // }, [eventStart, eventEnd]);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const retrieveEvents = () => {
        let url = `http://localhost:8000/ticketmaster?start=${eventStart}&end=${eventEnd}&country=${countryCode}&city=${citySearch}`
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
            // console.log(event)
            var name = event.name
            var description = event.info

            try {
                var category = event.classifications[0].genre.name
            } catch {
                var category = "N/A"
            }
            
            try {
                var location = event._embedded.venues[0].name
            } catch {
                var location = "N/A"
            }
            
            var event_id = event.id
            var image = event.images?.find((image) => image.width > 400 && image.ratio == "16_9")?.url

            return (
                <DateCard key={event_id} id={event_id} name={name} category={category} location={location} image={image}></DateCard>
            )
            
        })
    )
    
    const displayDates = (() => 
        dates.slice(firstCardIndex, lastCardIndex).map(function(date) {
            let name = date.title
            let category = date.category;
            let location = date.city
            let price = date.price
            let id = date.id
            let image = date.image

            return (
                <DateCard key={id} id={id} image={image} name={name} category={category} location={location} price={price}></DateCard>
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

    const DatesFilterBar = () => {
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

    const onStartDateChange = (date)  =>{
        // console.log(date, date.$d.getMonth())
        if (date.$D < 10) {
            var day = date.$D.toString().padStart(2,'0')
        } else {
            var day = date.$D.toString()
        }

        if (date.$M+1 < 10) {
            var month = date.$M+1
            month = month.toString().padStart(2,'0')
        } else {
            var month = date.$M+1
            month = month.toString()
        }

        let year = date.$y.toString()
        var startDate = year+"-"+month+"-"+day
        setEventStart(startDate)
    }

    const onEndDateChange = (date)  =>{
        if (date.$D < 10) {
            var day = date.$D.toString().padStart(2,'0')
        } else {
            var day = date.$D.toString()
        }

        if (date.$M+1 < 10) {
            var month = date.$M+1
            month = month.toString().padStart(2,'0')
        } else {
            var month = date.$M+1
            month = month.toString()
        }

        let year = date.$y.toString()
        var endDate = year+"-"+month+"-"+day

        setEventEnd(endDate)
    }

    const onCountrySelect = (event, value)  =>{
        setCountryCode(value.props.value)
    }

    const onCitySelect = (event)  =>{
        setCitySearch(event.target.value)
    }

    const onSearchEvent = (event)  =>{
        if (eventStart < currentDate) {
            alert("Event start date can't be before today's date!")
            setEventStart(currentDate)
            setEventInfo({start:currentDate,end:eventEnd,city:citySearch,country:countryCode})
        }

        if (eventEnd < eventStart) {
            alert("Event end date must be after start date!")
            setEventEnd(eventStart)
            setEventInfo({start:eventStart,end:eventStart,city:citySearch,country:countryCode})
        }

        if (eventStart >= currentDate && eventEnd >= eventStart) {
            setEventInfo({start:eventStart,end:eventEnd,city:citySearch,country:countryCode})
        }
        

        retrieveEvents()
    }

    const EventsFilterBar = () => {
        return (
            <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label={"Start Date"}
                        onChange={onStartDateChange}
                        sx={{ mx: 1, minWidth: 140 }}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label="End Date"
                        onChange={onEndDateChange}
                        sx={{ mx: 1, minWidth: 140 }}
                    />
                </LocalizationProvider>

                <TextField 
                    id="outlined-basic" 
                    label="City" 
                    variant="outlined" 
                    sx={{ mx: 1, minWidth: 140 }}
                    onChange={onCitySelect}
                />

                <FormControl sx={{ mx: 1, minWidth: 140 }}>
                    <InputLabel id="country-select-label">Country</InputLabel>
                    <Select
                        labelId="country-select-label"
                        id="country-select"
                        value={countryCode}
                        label="Country"
                        onChange={onCountrySelect}
                    >   
                        <MenuItem value="CA">Canada</MenuItem>
                        <MenuItem value="US">United States</MenuItem>
                    </Select>
                </FormControl>

                <Button variant ="contained" sx={{ m: 1}} onClick={onSearchEvent}>Search Dates</Button>
            </>
        )
    }

    return (
        <>
          <Outlet />
          <div className={`${outlet ? "hidden" : ""}`}>
            <div className="md:container mx-auto">
            <h1 className="font-display text-blue-500 font-bold text-4xl text-center my-4">Find Date Ideas</h1>
            <Tabs className="mb-2" value ={tabValue} onChange={handleChange} centered>
                <Tab value="0" label="Shared by Users" />
                <Tab value="1" label="Events/Concerts" />
            </Tabs>
            <div className="flex">
                <div className="mx-auto my-3">
                    {tabValue == "0" ?<>{DatesFilterBar()} </>: <>{EventsFilterBar()}</>}
                </div>
                
                
            </div>
            {tabValue != "0" ?
                <><div className="grid">
                    <div className="mx-auto my-3">
                        {eventInfo.city == "" ?
                            <><h3>Events happening between {eventInfo.start} to {eventInfo.end} in {eventInfo.country}:</h3></>:
                            <><h3>Events happening between {eventInfo.start} to {eventInfo.end} in <span style={{textTransform:'capitalize'}}>{eventInfo.city}</span>, {eventInfo.country}:</h3></>
                        }
                    </div>
                </div></>:
                <></>
            }
            
                <div className="grid grid-cols-4 gap-5 max-w-5xl mx-auto">
                    
                    {tabValue == "0" ? <>{displayDates()}</>: <>{displayEvents()}</>}
                </div>
                <div className="flex">
                    {tabValue == "0" ?
                        <><Pagination className="mx-auto my-4" page={currentPage} count={totalDatePageCount} color="primary" onChange={onPageChange} /></>:
                        <><Pagination className="mx-auto my-4" page={currentPage} count={totalEventPageCount} color="primary" onChange={onPageChange} /></>
                    }  
                </div>
            </div>
          </div>
        </>
    )
  }