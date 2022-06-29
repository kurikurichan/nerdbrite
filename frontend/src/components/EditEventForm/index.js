import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { updateEvent, getOneEvent, getForm, deleteEvent } from '../../store/events';

export default function EditEventForm() {

  // has .categories & .venues for our deets
  const currentState = useSelector(state => state.events);
  const hostId = useSelector(state => state.session.user.id);
  const eventId = currentState.id;

  console.log("event id: ", eventId);

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getForm()); // should get full categories & venues lists
      dispatch(getOneEvent(eventId)); // should get the individual event info
  }, [dispatch, eventId]);

  const history = useHistory();

  // TODO: these states should be setting values that already exist from the event data
//   const [venue, setVenue] = useState(currentState.event?.Venue.name);
//   const [category, setCategory] = useState(currentState.event?.Category.type);
//   const [name, setName] = useState(currentState.event?.name);
//   const [date, setDate] = useState(new Date(currentState.event?.date).toLocaleDateString('en-CA'));
//   const [capacity, setCapacity] = useState(currentState.event?.capacity);
//   const [errors, setErrors] = useState([]);

// redirect user if this isn't their event page
if (hostId !== currentState.event.hostId) (<Redirect to={`/api/events/${eventId}`} />)

const [venue, setVenue] = useState('');
const [category, setCategory] = useState('');
const [name, setName] = useState('');
const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
const [capacity, setCapacity] = useState(0);
const [errors, setErrors] = useState([]);

  // prefill fields with existing event data on initial page load
  useEffect(() => {
      setVenue(currentState?.event.Venue.name);
      setCategory(currentState?.event.Category.type);
      setName(currentState?.event.name);
      setDate(new Date(currentState?.event.date).toLocaleDateString('en-CA'));
      setCapacity(currentState?.event.capacity);
  }, []);

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

    let newEvent = await dispatch(updateEvent(payload)
      .catch(async (res) => {
        const formData = res.json();
        if (formData && formData.errors) setErrors(formData.errors);
      }));

    if (newEvent) {
        console.log("SUCCESSS! event updated")
        history.push(`/api/events/${newEvent.id}`);
    }

  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push(`/api/events/${eventId}`);
  }

  const handleDeleteClick = async (e) => {
    e.preventDefault(e);

    const deleted = await dispatch(deleteEvent(eventId));
    if (deleted) {
        console.log("successfully deleted")
        history.push('/api/events');
    }

  }

  return (
    <>
        <h1>Edit Event</h1>
        <section className="new-event-form-section">
            {currentState ?
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
                <button type="submit">Edit Event</button>
                <button className= "delete-button" onClick={handleDeleteClick}>Delete Event</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
            </form> :
            <p>Form Loading...</p>
            }
        </section>
    </>
  )
}