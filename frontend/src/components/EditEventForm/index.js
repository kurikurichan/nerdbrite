import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateEvent, getOneEvent, getForm, deleteEvent } from '../../store/events';

import '../NewEventForm/NewEventForm.css';

export default function EditEventForm({ eventLoaded }) {

  const event = useSelector(state => state.events.event);
  const categoryVenues = useSelector(state => state.events);
  const user = useSelector(state => state.session.user);

  const { eventId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getOneEvent(eventId)); // should get the individual event info
      dispatch(getForm()); // should get full categories & venues lists
  }, [dispatch, eventId]);

  const history = useHistory();

  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA', { timeZone: 'UTC', year: "numeric", month: "numeric", day: "numeric"  }));
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState([]);

  // prefill fields with existing event data on initial page load
  useEffect(() => {
      setVenue(event?.Venue.name);
      setCategory(event?.Category.type);
      setName(event?.name);
      // setDate(new Date(event?.date).toLocaleString('en-CA', { timeZone: 'UTC', year: "numeric", month: "numeric", day: "numeric" }));
      setCapacity(event?.capacity);
      setDescription(event?.description);
      setImage(event?.image);
  },[event]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);

    const payload = {
      hostId: user.id,
      venue,
      category,
      name,
      date,
      capacity,
      image,
      description
    };

    console.log("payload: ", payload);

    const updatedEvent = await(dispatch(updateEvent(payload, eventId)))
      .catch(async (err) => {
        const editData = await err.json();
        if (editData && editData.errors) setErrors(editData.errors);
    });

    if (updatedEvent) history.push(`/events/${eventId}`);

  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push(`/events/${eventId}`);
  }

  const handleDeleteClick = async (e) => {
    e.preventDefault(e);

    await dispatch(deleteEvent(eventId));
    history.push('/events');

  }
  if (!user) history.push('/');
  if (!event || !categoryVenues) return (<p>Loading...</p>);
  return (
        <section className="new-event-form-section">
            {event ?
              <div className="event-form-container">
                <h1 id="event-title">Edit Event</h1>
                  <form className="create-event-form" onSubmit={handleSubmit}>
                    <label className="event-label">
                      Event Name
                      <input
                        className="event-input"
                        type="text"
                        placeholder="Event Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label className="event-label">
                      Date of Event
                      <input
                        className="event-input"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                    <label className="event-label">
                      Venue
                      <select
                        className="event-input"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        >
                        <option value="" disabled>Venue</option>
                        {Array.isArray(categoryVenues.venues) &&
                        categoryVenues.venues.map(venue =>
                          <option key={venue.id}>{venue.name}</option>
                        )}
                      </select>
                    </label>
                    <label className="event-label">
                      Category
                      <select
                        className="event-input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        >
                        <option value="" disabled>Category</option>
                        {Array.isArray(categoryVenues.categories) && categoryVenues.categories.map(category =>
                          <option key={category.id}>{category.type}</option>
                        )}
                      </select>
                    </label>
                    <label className="event-label">
                      Capacity
                      <input
                        className="event-input"
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(+e.target.value)}
                        />
                    </label>
                    <label className="event-label">
                      Description
                      <textarea
                        className="form-description"
                        value={description}
                        rows="5"
                        cols="33"
                        wrap="soft"
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label className="event-label">
                      Image URL
                      <input
                        className="event-input"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        />
                    </label>
                    <div className = "errors-div">
                      <ul>
                      {errors.map((error, idx) => (
                        <li key={idx} className="errors">{error}</li>
                      ))}
                      </ul>
                    </div>
                    <div className="button-row">
                      <button type="submit" className="edit">Update Event</button>
                      <button className= "delete-button edit" onClick={handleDeleteClick}>Delete Event</button>
                      <button type="button" className="edit" onClick={handleCancelClick}>Cancel</button>
                    </div>
                  </form>
                </div> :
            <p className="loading">Form Loading...</p>
            }
        </section>
  )
}
