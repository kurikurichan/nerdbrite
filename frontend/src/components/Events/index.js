import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
    <div id="all-events-container">
        <h1 id="events-title">Events</h1>
            <ul>
                {Object.values(events).map((event) =>
                <div className="event-card"><li key={event.id}><Link to={`/events/${event.id}`}>{event.name}</Link></li></div>)}
            </ul>
    </div>
  );
};
