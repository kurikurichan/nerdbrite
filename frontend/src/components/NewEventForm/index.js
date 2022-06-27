import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getEvents } from '../../store/events';


export default function NewEventForm() {

  const currentState = useSelector(state => state);

  const history = useHistory();
  // TODO: set up form states

  // TODO: create form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const payload = {
    //   number,
    //   attack,
    //   defense,
    //   imageUrl,
    //   name,
    //   type,
    //   move1,
    //   move2,
    //   moves: [move1, move2]
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
          // value={number}
          // onChange={updateNumber} />
          />
        <input
          type="date"
          // placeholder="Attack"
          required
          // value={attack}
          // onChange={updateAttack}
          />
        <select>
          {/* {pokeTypes.map(type =>
            <option key={type}>{type}</option>
          )} */}
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
