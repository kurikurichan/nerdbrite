import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvents } from '../../store/events';
import './events.css';

export default function Events() {

    const events = useSelector(state => {
        return state.events;
    });

    console.log("list of events state: ", events);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

  return (
    <div id="all-events-container">
        <h1 id="events-title">Events</h1>
        { events &&
            <ul>
                {Object.values(events).map((event, i) =>
                <div key={i} className="event-card">
                    <li>
                        <Link to={`/events/${event.id}`}>{event.name}</Link>
                    </li>
                </div>)}
            </ul>
        }
    </div>
  );
};
