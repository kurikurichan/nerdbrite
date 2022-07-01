import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateEvent, getOneEvent, getForm, deleteEvent } from '../../store/events';

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

    await(dispatch(updateEvent(payload, eventId)))
      .catch(async (err) => {
        const editData = await err.json();
        if (editData && editData.errors) setErrors(editData.errors);
    });

    history.push(`/events/${eventId}`);

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
  if (!event || !user || !categoryVenues) return (<p>Loading...</p>);
  return (
    <>
        <h1>Edit Event</h1>
        <section className="new-event-form-section">
            {event ?
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
                <button type="submit" className="edit">Edit Event</button>
                <button className= "delete-button edit" onClick={handleDeleteClick}>Delete Event</button>
                <button type="button" className="edit" onClick={handleCancelClick}>Cancel</button>
            </form> :
            <p className="loading">Form Loading...</p>
            }
        </section>
    </>
  )
}
