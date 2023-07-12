import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DateForm(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span  className='text-blue-600 text-2xl font-display font-semibold italic' style={{ fontWeight: "bold" }}>
            Share Your Perfect Date Idea! </span>
          <div style={{ fontSize: '14px', color: '#777' }} className="subtitle">Share Love, Effortlessly</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="Title" className="form-label">
              Title
            </label>
            <input
              type="text"
              name="Title"
              className="form-control"
              id="Title"
              required
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
                >
                  <option value="">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="Category">Category</label>
                <select className="form-control" id="Category" name="mood">
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
                <label htmlFor="time_of_day">Preferred Time of Day</label>
                <select
                  className="form-control"
                  id="time_of_day"
                  name="time_of_day"
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
                ></input>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center mt-2">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default DateForm;
