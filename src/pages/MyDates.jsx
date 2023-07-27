import DateCard from "../components/DateCard";
import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import AddDate from "../components/AddDate";
import { getTicketmasterEvents } from "../api/external/ticketmaster";
import { useAuthContext } from "../hooks/useAuthContext";
import { getUserById } from "../api/internal/postgres";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function MyDates() {
  const { user } = useAuthContext();
  const [dates, setDates] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [tabValue, setTabValue] = useState("0");

  // For pagination viewing
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(12);
  const lastCardIndex = currentPage * cardsPerPage;
  const firstCardIndex = lastCardIndex - cardsPerPage;
  const totalPageCount = Math.ceil(dates.length / cardsPerPage);
  const totalFavPageCount = Math.ceil(favorites.length / cardsPerPage);

  useEffect(() => {
    retrieveDates();
    retrieveFavorites();
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    retrieveFavorites();
  };

  const retrieveDates = () => {
    let url = `http://localhost:8000/mydates?user=${user.id}`;
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

  const retrieveFavorites = () => {
    let url = `http://localhost:8000/favorites?user=${user.id}`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setFavorites(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const displayCards = () =>
    dates.slice(firstCardIndex, lastCardIndex).map(function (date) {
      let name = date.title;
      let description = date.description;
      let category = date.category;
      let location = date.city;
      let id = date.id;

      var check = (fav) => fav.id === id;
      if (favorites.some(check)) {
        var isFav = true;
      } else {
        var isFav = false;
      }

      return (
        <DateCard
          key={id}
          id={id}
          name={name}
          category={category}
          location={location}
          inFavorite={isFav}
        ></DateCard>
      );
    });

  const displayFavorites = () =>
    favorites.slice(firstCardIndex, lastCardIndex).map(function (fav) {
      let name = fav.title;
      let description = fav.description;
      let category = fav.category;
      let location = fav.city;
      let locationCountry = fav.country;
      let locationAddress = fav.detailed_address;
      let id = fav.id;

      var check = (fav) => fav.id === id;
      if (favorites.some(check)) {
        var nextFav = true;
      } else {
        var nextFav = false;
      }
      return (
        <DateCard
          key={id}
          id={id}
          name={name}
          category={category}
          location={location}
          inFavorite={nextFav}
        ></DateCard>
      );
    });

  const onPageChange = (evt, page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {dates.length === 0 ? (
        <AddDate
          retrieveDates={retrieveDates}
          retrieveFavorites={retrieveFavorites}
        />
      ) : (
        <div className="md:container mx-auto">
          <h1 className="font-display text-blue-500 font-bold text-4xl text-center my-4">
            Your Personal Date Ideas
          </h1>
          <Tabs
            className="mb-2"
            value={tabValue}
            onChange={handleChange}
            centered
          >
            <Tab value="0" label="Your Date Ideas" />
            <Tab value="1" label="Favorites" />
          </Tabs>
          <div className="grid grid-cols-4 gap-5 max-w-5xl mx-auto">
            {tabValue == "0" ? (
              <>{displayCards()}</>
            ) : (
              <>{displayFavorites()}</>
            )}
          </div>
          <div className="flex">
            {tabValue == "0" ? (
              <>
                <Pagination
                  className="mx-auto my-4"
                  page={currentPage}
                  count={totalPageCount}
                  color="primary"
                  onChange={onPageChange}
                />
              </>
            ) : (
              <>
                <Pagination
                  className="mx-auto my-4"
                  page={currentPage}
                  count={totalFavPageCount}
                  color="primary"
                  onChange={onPageChange}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
