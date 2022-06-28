import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../../store/events';
import './events.css';

export default function Events() {

    const events = useSelector(state => {
        return state.events;
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

  return (
    <>
        <div>Events</div>
            <ul>
                {Object.values(events).map((event) =>
                <li key={event.id}>{event.name}</li>)}
            </ul>
    </>
  );
};
