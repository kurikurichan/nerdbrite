import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { addEvent, getEditForm } from '../../store/events';

export default function EditEventForm() {

  // has .categories & .venues for our deets
  const currentState = useSelector(state => state.events);
  const hostId = useSelector(state => state.session.user.id);

  console.log("CURRENT STATE IN EDIT FORM!!!!!!: ", currentState);

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getEditForm());
  }, [dispatch]);


  const history = useHistory();

  // TODO: these states should be setting values that already exist from the event data
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [capacity, setCapacity] = useState(0);
  const [errors, setErrors] = useState([]);

  // TODO: create form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      hostId,
      venue,
      category,
      name,
      date,
      capacity
    };

    console.log("payload: ", payload);

    let newEvent = await dispatch(addEvent(payload))
      .catch(async (res) => {
        const formData = res.json();
        if (formData && formData.errors) setErrors(formData.errors);
      });

    if (newEvent) {
      // history.push(`/events/${newEvent.id}`);
      console.log("SUCCESSS! new event created")
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push('/events');
  }

  return (
    <>
        <h1>Edit Event</h1>
        <section className="new-event-form-section">
        <form className="create-event-form" onSubmit={handleSubmit}>
            <ul>
            {errors.map(err =>
                <li key={err}>{err}</li>)}
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
        </section>
    </>
  )
}
