import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addEvent, getForm } from '../../store/events';

import './NewEventForm.css';

export default function NewEventForm() {

  const currentState = useSelector(state => state.events);
  const user = useSelector(state => state.session.user);

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getForm());
  }, [dispatch]);


  const history = useHistory();

  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [capacity, setCapacity] = useState(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState([]);

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

    const newEvent = await(dispatch(addEvent(payload)))
      .catch(async (res) => {
        const formData = await res.json();
        if (formData && formData.errors) setErrors(formData.errors);
    });

    if (newEvent) {
      history.push(`/events/${newEvent.id}`);
    }

  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push('/events');
  }

  if (!user) history.push('/');

  return (
    <section>
      { currentState ?
      <div className="event-form-container">
        <h1 id="event-title">Create a New Event</h1>
        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className = "errors-div">
            <ul>
            {errors.map((error, idx) => (
              <li key={idx} className="errors">{error}</li>
            ))}
            </ul>
          </div>
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
              {Array.isArray(currentState.venues) &&
              currentState.venues.map(venue =>
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
              {Array.isArray(currentState.categories) && currentState.categories.map(category =>
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
              className="description"
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
          <button type="submit">Create new Event!</button>
          <button type="button" onClick={handleCancelClick}>Cancel</button>
        </form>
      </div> :
      <p>Form Loading</p>}
    </section>
  )
}
