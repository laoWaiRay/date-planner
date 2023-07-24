import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getTicketmasterEventById } from "../api/external/ticketmaster";
import { getAverageReviewScore, getEventById, getLocationById, getReviews, getUserById } from "../api/internal/postgres";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateReviewModal from "../components/CreateReviewModal";
import Review from "../components/Review";
import { Button } from "react-bootstrap";
import { getDefaultImage } from "../helpers/getDefaultImage";
import { Rating } from "@mui/material";
import { Delete, Edit, Favorite, Send } from "@mui/icons-material";
import { useAuthContext } from "../hooks/useAuthContext";
import DateForm from "../components/DateForm";
import CreateDateInvite from "../components/DateInviteModal"
import DeleteWarningModal from "../components/DeleteWarningModal";

const isAPIevt = (id) => {
  return id.length > 10;
}

export default function Details() {
  const { id } = useParams();
  const [isAPIEvent] = useState(isAPIevt(id));
  const [data, setData] = useState({});
  const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [averageScore, setAverageScore] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const postData = async (body) => {
    await fetch("http://localhost:8000/mydates", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
  }

  const initFormValues = {
    event_id: id,
    title: data.title,
    date_idea: data.description,
    location: data.venue,
    city: data.city,
    country: data.country,
    price_range: data.price,
    category: data.category,
    preferred_time: data.preferred_time,
    comments: data.comments
  }

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
        const userData = await getUserById(eventData.author);
        const locationData = await getLocationById(eventData.location_id);
        setData(extractDataFromUserEvent(eventData, userData, locationData));
        await fetchAverageScore();
<<<<<<< HEAD
      }
=======
        }
>>>>>>> origin
    })()
  }, [modalShow])

  useEffect(() => {
    if (isAPIEvent) return;
    (async () => {
      const updatedReviews = await getReviews(id);
      setReviews(updatedReviews);
      await fetchAverageScore();
    })()
  }, [isCreateReviewModalOpen, toggle])

  
  const triggerRerender = () => {
    setToggle(!toggle);
  }

  const handleNavigate = () => {
    navigate(-1);
  }

  const fetchAverageScore = async () => {
    let avg = (await getAverageReviewScore(id)).avg;
    if (!avg) {
      setAverageScore(0.0);
    }
    else {
      avg = Math.round(parseFloat(avg) * 10) / 10;
    }
    setAverageScore(avg);
  }

  return (
    <div className="grid grid-cols-2 -my-12">
      {/* Details Section */}
      <section className="overscroll-y-scroll m-8 mr-4 flex flex-col">
        <div className="flex flex-col">
          {/* Image */}
          <img src={data.imageURL} alt={data.title} className="max-w-full aspect-[16/9] object-cover rounded-md mb-2"/>

          {/* Title and Average Score */}
          <div>
<<<<<<< HEAD
            <div className="flex items-center space-x-1 px-2">
              <h2 className="text-2xl m-0">{data.title}</h2>

              { (!isAPIEvent && user.username == data.author) && (
                <>
                <button onClick={() => setModalShow(true)}>
                  <Edit />
                </button>
                <button onClick={() => setShowDeleteModal(true)}>
                  <Delete />
                </button>
                </>
              )}
              
              {/* Buttons to like and share */}
              <div className="!ml-auto space-x-4">
                <button type="button">
                  <Favorite />
                </button>
                <button type="button" onClick={() => setShowInviteModal(true)}>
                  <Send className="-rotate-45 -translate-y-[3px]"/>
                </button>
              </div>
              
            </div>
            {
              (averageScore > 0.0) && (
                <div className="flex items-center space-x-2 px-1">
=======
            <h2 className="text-2xl m-0">{data.title}</h2>
            {
              (averageScore > 0.0) && (
                <div className="flex items-center space-x-2">
>>>>>>> origin
                  <Rating 
                    value={averageScore}
                    readOnly
                    precision={0.1}
                  />
                  <span className="text-lg font-semibold">{averageScore}</span>
                </div>
              )
            }
          </div>

          {/* General details */}
          <div className="my-2 p-2 border">
            {/* Date */}
            {data.date && 
              <div>{data.date}</div>
            }

            <div>From: <b>{data.author}</b></div>

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

            {data.link &&
              <a href={data.link}>More Info</a>
            }
          </div>

          {/* Description and extra notes*/}
          <p className="px-2">{data.description}</p>
          <p className="px-2">{data.comments}</p>

        </div>
      </section>

      {/* Reviews Section */}
      {!isAPIEvent && 
        <section className="flex flex-col m-8 ml-4">
          <div className="flex space-x-4 items-center -mt-2 pb-2 border-b-2">
            <h2 className="text-2xl m-0">Reviews</h2>
            <button type="button" onClick={() => {setIsCreateReviewModalOpen(true)}}>
              <AddCircleOutlineIcon className="text-blue-400 opacity-80 hover:opacity-100" fontSize="large" />
            </button>
            <div className="!ml-auto">
              <Button onClick={handleNavigate}>Go Back</Button>
            </div>
          </div>
          <div>
            {reviews.map((review) => (
              <Review 
                key={review.id}
                review={review}
                triggerRerender={triggerRerender}
              />
            ))}
          </div>
        </section>
      }

      {/* Popup Modal for Create Review */}
      {isCreateReviewModalOpen && 
        <CreateReviewModal 
          onClose={() => setIsCreateReviewModalOpen(false)} 
          eventId={id}
        />
      }
      
      {isAPIEvent && 
        <div className="mt-8 w-full space-x-4">
          <Button className="ml-auto mr-8" onClick={handleNavigate}>Go Back</Button>
        </div>
      }

      {/* Popup form for editing event */}
      <DateForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        postData={postData}
        initValues={initFormValues}
      />

      {/* Popup for date invite */}
      {showInviteModal && (<CreateDateInvite onClose={() => setShowInviteModal(false)} eventID={id}/>)}

      {/* Popup warning for delete post */}
      {showDeleteModal && 
        <DeleteWarningModal 
          onClose={() => setShowDeleteModal(false)} 
          eventId={id} 
          event_username={data.author}
        />
      }
    </div>
  )
}

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
    description:          data.description,
    imageURL:             data.image || getDefaultImage(data.category),
    comments:             data.comments
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
      imageURL:           data?.images?.find((image) => image.width > 1000 && image.ratio == "16_9")?.url,
      date:               data?.dates?.start?.localDate,
      link:               data?.url,
      comments:           data?.pleaseNote
    }
}
