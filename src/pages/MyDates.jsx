import DateCard from "../components/DateCard";
import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import AddDate from "../components/AddDate";
import { getTicketmasterEvents } from "../api/external/ticketmaster";

export default function MyDates() {
  const [dates, setDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(12);

  const lastCardIndex = currentPage * cardsPerPage;
  const firstCardIndex = lastCardIndex - cardsPerPage;
  const totalPageCount = Math.ceil(dates.length / cardsPerPage);

  useEffect(() => {
    // retrieveDates();
  }, []);

  const retrieveDates = async () => {
    const dates = await getTicketmasterEvents();
    setDates(dates);
  };

  const displayCards = () =>
    dates.slice(firstCardIndex, lastCardIndex).map(function (date) {
      console.log(date);
      let name = date.title;
      let description = date.description;
      let category = date.category;
      let location = date.city;
      let id = date.id;
      // let price = date.price     // TO ADD IN PRICE
      return (
        <DateCard
          key={id}
          id={id}
          name={name}
          description={description}
          category={category}
          location={location}
        ></DateCard>
      );
    });

  const onPageChange = (evt, page) => {
    setCurrentPage(page);
  };

  // var datesList = dates.map(function (date) {
  //   let name = date.name;
  //   let description = date.description;
  //   let category = date.category;
  //   let location = date.location;
  //   let id = date.id;
  //   return (
  //     <DateCard
  //       key={id}
  //       id={id}
  //       name={name}
  //       description={description}
  //       category={category}
  //       location={location}
  //     ></DateCard>
  //   );
  // });

  return (
    <>
      {dates.length === 0 ? (
        <AddDate retrieveDates={retrieveDates} />
      ) : (
        <div className="md:container mx-auto">
          <h1 className="font-display text-blue-500 font-bold text-4xl text-center my-4">
            Your Personal Date Ideas
          </h1>
          <div className="grid grid-cols-4 gap-5 max-w-5xl mx-auto">
            {displayCards()}
          </div>
          <div className="flex">
            <Pagination
              className="mx-auto my-4"
              page={currentPage}
              count={totalPageCount}
              color="primary"
              onChange={onPageChange}
            />
          </div>
        </div>
      )}
    </>
  );
}
