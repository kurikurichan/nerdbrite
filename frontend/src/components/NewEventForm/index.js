import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getEvents, getForm } from '../../store/events';

export default function NewEventForm() {

  // has .categories & .venues for our deets
  const currentState = useSelector(state => state.events);

  console.log("categories: ", Array.isArray(currentState.categories));

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getForm());
  }, [dispatch]);


  const history = useHistory();

  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('doop');
  const [date, setDate] = useState('');
  const [capacity, setCapacity] = useState(0);

  // TODO: create form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const payload = {
    //   hostId,
    //   venueId,
    //   categoryId,
    //   name,
    //   date,
    //   capacity
    // };

    // console.log("payload: ", payload);

    let newEvent;

  //   try {
  //     newEvent = await dispatch(addEvent(payload));
  //     console.log('newEvent: ', newEvent);
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   if (newEvent) {
  //     history.push(`/events/${newEvent.id}`);
  //   }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push('/events');
  }

  return (
    <section className="new-event-form-section">
      <form className="create-event-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        <input
          type="date"
          // placeholder="Attack"
          required
          // value={attack}
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
          placeholder="0"
          // value={move2}
          // onChange={updateMove2}
          />
        <button type="submit">Create new Event!</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  )
}
