import DateCard from "../components/DateCard";
import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function PublicDates() {
  const [dates, setDates] = useState([]);
  const [events, setEvents] = useState([]);
  const [tabValue, setTabValue] = useState("0");
  const [page, setPage] = useState(0);

  useEffect(() => {
    retrieveEvents();
    retrieveDates();
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event, value) => {
    console.log(value)
    setPage(value);
  };

  const retrieveEvents = () => {
    let url = `http://localhost:8000/ticketmaster`;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const getEventsList = () => {
    return events.slice(((page - 1) * 4), ((page - 1) * 4) + 4).map(function (date) {
      var name = date.name;
      var description = date.info;
      var category = date.classifications[0].genre.name;
      var location = date._embedded.venues[0].name;
      var id = date.id;

      if (date.images[1]) {
        var image = date.images[1].url;
      } else {
        var image = date.images[0].url;
      }

      return (
        <DateCard
          key={id}
          name={name}
          category={category}
          location={location}
          image={image}
        />
      );
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
        category={category}
        location={location}
      />
    );
  });

  return (
    <>
      <div className="mx-auto -mt-4">
        <h1 className="font-display text-blue-500 font-bold text-4xl flex justify-center">
          Find Date Ideas
        </h1>
        <Tabs
          className="mb-2"
          value={tabValue}
          onChange={handleChange}
          centered
        >
          <Tab value="0" label="Shared by Users" />
          <Tab value="1" label="Events/Concerts" />
        </Tabs>
        <div className="grid grid-cols-4 gap-2 max-w-6xl mx-auto mt-4">
          {tabValue == "0" ? <>{datesList}</> : <>{getEventsList()}</>}
        </div>
      </div>

      <Pagination
        className="flex justify-center fixed bottom-4 w-full"
        count={10}
        color="primary"
        onChange={handlePageChange}
      />
    </>
  );
}
