// import Button from "react-bootstrap/Button";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import resizeImage from "../helpers/resizeImage";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function DateForm(props) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const newEvent = {
    title: "",
    date_idea: "",
    location: "",
    city: "",
    country: "",
    price_range: "",
    category: "",
    preferred_time: "",
    comments: "",
    image: "",
    private: false,
  };
  const [error, setError] = useState("")

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormValues({ ...formValues, [name]: newValue });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file.type == "image/jpeg" || file.type == "image/png") {
      setError("")
      const reader = new FileReader();

      const handleLoadEvent = async () => {
        const resizedImg = await resizeImage(reader.result, 1600);
        setFormValues({ ...formValues, image: resizedImg });
        reader.removeEventListener("loadend", handleLoadEvent);
      };

      reader.addEventListener("loadend", handleLoadEvent);
      reader.readAsDataURL(file);
    } else {
      setError("Must be jpg or png")
    }
  };

  const handleReset = () => {
    setFormValues({ ...newEvent });
    setError("")
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const body = {
        date: { ...formValues, author: user.id },
      };
      await props.postData(body);
      
      setFormValues({ ...newEvent });
      props.onHide();
      if (props.redirect) {
        navigate(props.redirect);
      }
    } catch (error) {
      setError(error.message)
      console.error(error);
    }
  };

  const [formValues, setFormValues] = useState(newEvent);

  useEffect(() => {
    if (props.initValues) {
      setFormValues({ ...newEvent, ...props.initValues });
      setError("")
    }
  }, [props.show]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ overlay: { zIndex: 1000 } }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span
            className="text-blue-600 text-2xl font-display font-semibold italic"
            style={{ fontWeight: "bold", color: "#39798f" }}
          >
            Share Your Perfect Date Idea!{" "}
          </span>
          <div style={{ fontSize: "14px", color: "#777" }} className="subtitle">
            Share Love, Effortlessly
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="Title" className="form-label">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              id="title"
              required
              value={formValues.title}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date_idea" className="form-label">
              Date Idea
            </label>
            <textarea
              name="date_idea"
              className="form-control"
              id="date_idea"
              required
              value={formValues.date_idea}
              onChange={handleFormChange}
            ></textarea>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  id="location"
                  required
                  value={formValues.location}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  id="city"
                  required
                  value={formValues.city}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  name="country"
                  className="form-control"
                  id="country"
                  required
                  value={formValues.country}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="price_range">Price Range</label>
                <select
                  className="form-control"
                  id="price_range"
                  name="price_range"
                  required
                  value={formValues.price_range}
                  onChange={handleFormChange}
                >
                  <option value="">Select Price</option>
                  <option value="Free">Free</option>
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                  <option value="$$$$">$$$$</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  className="form-control"
                  id="category"
                  name="category"
                  required
                  value={formValues.category}
                  onChange={handleFormChange}
                >
                  <option value="">Select a Category</option>
                  <option value="romantic">Romantic</option>
                  <option value="stayathome">Stay at Home</option>
                  <option value="adventurous">Adventurous</option>
                  <option value="relaxing">Relaxing</option>
                  <option value="cultural">Cultural</option>
                  <option value="natureandoutdoors">Outdoors</option>
                  <option value="foodanddrink">
                    Food and Drink
                  </option>
                  <option value="intellectual">
                    Intellectual and Educational
                  </option>
                  <option value="musicandentertainment">
                    Music and Entertainment
                  </option>
                  <option value="seasonal">Seasonal</option>
                  <option value="technologyandgaming">
                    Technology and Gaming
                  </option>
                  <option value="mysteryandadventure">
                    Mystery
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="preferred_time">Preferred Time of Day</label>
                <select
                  className="form-control"
                  id="preferred_time"
                  name="preferred_time"
                  required
                  value={formValues.preferred_time}
                  onChange={handleFormChange}
                >
                  <option value="">Select a preferred time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="comments">Comments</label>
                <input
                  type="text"
                  name="comments"
                  className="form-control"
                  id="comments"
                  value={formValues.comments}
                  onChange={handleFormChange}
                ></input>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-group">
                <div className="form-check">
                  <label htmlFor="private">Make this date idea private?</label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="private"
                    name="private"
                    checked={formValues.private}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-group">
                <div className="mb-3">
                  <label htmlFor="formImage" className="form-label">
                    Image Upload {error && <span className="text-red-500"> - {error}</span>}
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formImage"
                    name="formImage"
                    onChange={(e) => handleImageUpload(e)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12 text-center">
              <Button
                variant="primary"
                type="submit"
                className="w-50 my-2"
                sx={{
                  backgroundColor: "#39798f",
                  color: "white",
                  ":hover": { bgcolor: "#1d3d48" },
                }}
                disabled={error}
              >
                Submit
              </Button>
            </div>
            <div className="col-md-12 text-center">
              <Button
                variant="contained"
                onClick={handleReset}
                type="reset"
                color="error"
                className="w-50 my-2"
                // sx={{
                //   backgroundColor: "#39798f",
                //   color: "white",
                //   ":hover": { bgcolor: "#1d3d48" },
                // }}
              >
                Reset
              </Button>
            </div>
            
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default DateForm;
