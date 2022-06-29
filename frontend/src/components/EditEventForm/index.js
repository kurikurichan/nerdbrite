import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { updateEvent, getOneEvent, getForm, deleteEvent } from '../../store/events';

export default function EditEventForm({ eventLoaded }) {

  // has .categories & .venues for our deets
  const event = useSelector(state => state.events.event);
  const categoryVenues = useSelector(state => state.events);
  const hostId = useSelector(state => state.session.user.id);

  const { eventId } = useParams();

  // attempt to redirect user if store isn't loaded yet
//   if (!eventLoaded) (<Redirect to={`/api/events/${eventId}`} />)

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getOneEvent(eventId)); // should get the individual event info
      dispatch(getForm()); // should get full categories & venues lists
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
// if (!eventId) history.push("/api/events");
// if (hostId !== event.hostId) (<Redirect to={`/api/events/${eventId}`} />)

const [venue, setVenue] = useState('');
const [category, setCategory] = useState('');
const [name, setName] = useState('');
const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
const [capacity, setCapacity] = useState(0);
const [errors, setErrors] = useState([]);

  // prefill fields with existing event data on initial page load
  useEffect(() => {
      setVenue(event?.Venue.name);
      setCategory(event?.Category.type);
      setName(event?.name);
      setDate(new Date(event?.date).toLocaleDateString('en-CA'));
      setCapacity(event?.capacity);
  },[event]);

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

    await(dispatch(updateEvent(payload, eventId)))
      .catch(async (res) => {
      const editData = res.json();
      console.log("The edit data: ", editData);
      if (editData && editData.errors) {
        setErrors(editData.errors);
      } else {
        console.log("did not get errors or something???")
      }
    });

    console.log("SUCCESSS! event updated");
    history.push(`/api/events/${eventId}`);

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
  if (!event || !hostId || !categoryVenues) return (<p>Loading...</p>);
  return (
    <>
        <h1>Edit Event</h1>
        <section className="new-event-form-section">
            {event ?
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
                {Array.isArray(categoryVenues.venues) &&
                categoryVenues.venues.map(venue =>
                    <option key={venue.id}>{venue.name}</option>
                )}
                </select>
                <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                <option value="" disabled>Category</option>
                {Array.isArray(categoryVenues.categories) && categoryVenues.categories.map(category =>
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
