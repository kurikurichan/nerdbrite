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
  const [capacity, setCapacity] = useState(0);
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
      capacity
    };

    console.log("payload: ", payload);

    const newEvent = await(dispatch(addEvent(payload)))
      .catch(async (res) => {
        const formData = await res.json();
        if (formData && formData.errors) setErrors(formData.errors);
    });

    history.push(`/events/${newEvent.id}`);

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
          <ul>
          {errors.map((error, idx) => (
            <li key={idx} className="errors">{error}</li>
          ))}
          </ul>
          <input
            type="text"
            placeholder="Event Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
          <input
            type="date"
            defaultValue={new Date().toLocaleDateString('en-CA')}
            required
            onChange={(e) => setDate(e.target.value)}
            />
          <select
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            >
            <option value="" disabled>Venue</option>
            {Array.isArray(currentState.venues) &&
            currentState.venues.map(venue =>
              <option key={venue.id}>{venue.name}</option>
            )}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            >
            <option value="" disabled>Category</option>
            {Array.isArray(currentState.categories) && currentState.categories.map(category =>
              <option key={category.id}>{category.type}</option>
            )}
          </select>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(+e.target.value)}
            />
          <button type="submit">Create new Event!</button>
          <button type="button" onClick={handleCancelClick}>Cancel</button>
        </form>
      </div> :
      <p>Form Loading</p>}
    </section>
  )
}
