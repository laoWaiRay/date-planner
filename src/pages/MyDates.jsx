import DateCard from "../components/DateCard";
import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import HomeScreen from "../components/HomeScreen";


export default function MyDates() {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    retrieveDates();
  }, []);

  const retrieveDates = () => {
    let url = `http://localhost:8000/mydates`;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDates(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  var datesList = dates.map(function (date) {
    let name = date.name;
    let description = date.description;
    let category = date.category;
    let location = date.location;
    let id = date.id;
    return (
      <DateCard
        key={id}
        name={name}
        description={description}
        category={category}
        location={location}
      ></DateCard>
    );
  });

 return (
  <>
    {datesList.length === 0 ? (
      <HomeScreen />
    ) : (
      <div className="md:container mx-auto">
        <h1 className="font-display text-blue-500 font-bold text-4xl text-center my-5">
          Your Personal Date Ideas
        </h1>
        <div className="grid grid-cols-4 gap-5 max-w-5xl mx-auto">
          {datesList}
        </div>
        <Pagination className="mx-auto" count={10} color="primary" />
      </div>
    )}
  </>
);

}
