import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function DateForm(props) {
  const { user } = useAuthContext();
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
    image: ""
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handlePrivateCheckboxChange = () => {
    setIsPrivate(!isPrivate);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file.type == "image/jpeg" || file.type == "image/png") {
      console.log("OK")
      console.log(file)

      const reader = new FileReader();

      const handleLoadEvent = async () => {
        const resizedImg = await resizeImage(reader.result, 1600);
        setFormValues({...formValues, image: resizedImg});
        reader.removeEventListener("loadend", handleLoadEvent);
      }
      
      reader.addEventListener("loadend", handleLoadEvent);
      reader.readAsDataURL(file);
    }
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const body = {
        date: { ...formValues, isPrivate: isPrivate, author: user.id },
      };
      await props.postData(body);
      setFormValues({ ...newEvent });
      setIsPrivate(false);
      props.onHide();
    } catch (error) {
      console.error(error.message);
    }
  };

  const [formValues, setFormValues] = useState(newEvent);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (props.initValues) {
      console.log("DEBUG", props.initValues)
      setFormValues({ ...newEvent, ...props.initValues })
    }
  }, [props.show])

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{overlay: {zIndex: 1000}}}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span
            className="text-blue-600 text-2xl font-display font-semibold italic"
            style={{ fontWeight: "bold" }}
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
          <div className="row">
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
          <div className="row">
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
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
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
                  <option value="stayathome">Stay at home</option>
                  <option value="adventurous">Adventurous</option>
                  <option value="relaxing">Relaxing</option>
                  <option value="indoor">Indoor</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
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
          <div className="row" style={{ marginTop: "2%" }}>
            <div className="col-md-12">
              <div className="form-group">
                <div className="form-check">
                  <label htmlFor="private">Make this date idea private?</label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="private"
                    name="private"
                    checked={isPrivate}
                    onChange={handlePrivateCheckboxChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="row" style={{ marginTop: "2%" }}>
            <div className="col-md-12">
              <div className="form-group">
                <div className="mb-3">
                  <label htmlFor="formImage" className="form-label">Image Upload</label>
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

          <div className="row" style={{ marginTop: "2%" }}>
            <div className="col-md-12 text-center">
              <Button variant="primary" type="reset" className="w-50">
                Reset
              </Button>
            </div>
            <div className="col-md-12 text-center">
              <Button variant="primary" type="submit" className="w-50 mt-2">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

// Credit to "https://gist.github.com/ORESoftware/ba5d03f3e1826dc15d5ad2bcec37f7bf" for code snippet
const resizeImage = (base64Str, maxWidth = 400, maxHeight = 350) => {
  return new Promise((resolve) => {
    let img = new Image()
    img.src = base64Str
    img.onload = () => {
      let canvas = document.createElement('canvas')
      const MAX_WIDTH = maxWidth
      const MAX_HEIGHT = maxHeight
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }

      canvas.width = width
      canvas.height = height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL())
    }
  })
}

export default DateForm;
