import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getTicketmasterEventById } from "../api/external/ticketmaster";
import { getEventById, getLocationById, getUserById } from "../api/internal/postgres";

const isAPIevt = (id) => {
  return id.length > 10;
}

export default function Details() {
  const { id } = useParams();
  const [isAPIEvent] = useState(isAPIevt(id));
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      let eventData;

      // Detail page is for an event from Ticketmaster API
      if (isAPIEvent) {
        eventData = await getTicketmasterEventById(id);
        setData(extractDataFromTicketmaster(eventData));
      } else {
        // Detail page is for a user-submitted event
        eventData = await getEventById(id);
        const userData = await getUserById(id);
        const locationData = await getLocationById(eventData.location_id);
        setData(extractDataFromUserEvent(eventData, userData, locationData));
      }

      console.log(eventData)
    })()
  }, [])

  const extractDataFromUserEvent = (data, userData, location) => {
    return {
      title:                data.title,
      author:               userData.username,
      price:                data.price,
      category:             data.category,
      preferred_time:       data.preferred_time,
      city:                 location.city,
      country:              location.country,
      venue:                location.detailed_address,
      date_posted:          data.date_posted,
      description:          data.description
    }
  }

  const extractDataFromTicketmaster = (data) => {
      return {
        title:              data.name,
        author:             "Ticketmaster",
        venue:              data?._embedded?.venues?.[0]?.name,
        city:               data?._embedded?.venues?.[0]?.city?.name,
        country:            data?._embedded?.venues?.[0]?.country?.name,
        minPrice:           data?.priceRanges?.[0]?.min,
        maxPrice:           data?.priceRanges?.[0]?.max,
        currency:           data?.priceRanges?.[0]?.currency,
        category:           data?.classifications?.[0]?.genre?.name,
        description:        data?.info,
        imageURL:           data?.images?.find((image) => image.width > 1000 && image.ratio == "16_9")?.url
      }
  }

  return (
    <div className="grid grid-cols-2 -my-12">
      {/* Details Section */}
      <section className="overscroll-y-scroll p-8 flex flex-col">
        <div className="flex flex-col">
          {/* Image */}
          <img src={data.imageURL} alt={data.title} className="max-w-xl rounded-md mb-2"/>

          <h2 className="text-2xl m-0">{data.title}</h2>

          {/* General details */}
          <div className="my-2">
            <div>From {data.author}</div>

            {/* Location details */}
            <div>{data.venue}</div>
            {data.city &&
              <div>{data.city}, {data.country}</div>
            }

            {/* Category details */}
            <div>
              {data.category && <>Category: {data.category.charAt(0).toUpperCase() + data.category.slice(1)}</>}
            </div>
            
            {/* Price details */}
            <div>
              {data.currency && 
                <>Starting from <b>${data.minPrice + " " + data.currency}</b></>
              }
              {data.price &&
                <>Price: {data.price}</>
              }
            </div>
          </div>

          {/* Description */}
          <p>
            {data.description}
            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias tempore minima sunt accusamus quibusdam similique, nisi voluptatem possimus provident eveniet, quasi quis. Aliquid, voluptate sit distinctio fugiat ea perspiciatis error.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias tempore minima sunt accusamus quibusdam similique, nisi voluptatem possimus provident eveniet, quasi quis. Aliquid, voluptate sit distinctio fugiat ea perspiciatis error. */}
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="flex flex-col p-8">
        <h2 className="text-2xl m-0">Reviews</h2>
      </section>
    </div>
  )
}