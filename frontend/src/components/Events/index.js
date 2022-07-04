import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvents } from '../../store/events';
import './events.css';

import altImage from '../../alt_event_image.jpeg';

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
        <h1 id="events-title">Events</h1>
            { events &&
                <div id="all-events-container">
                    {Object.values(events).map((event, i) =>
                    <div key={i} className="event-card">
                        <Link to={`/events/${event.id}`}>
                            <img src={event.image} className="card-pic" onError={({ img }) => {
                                img.src= altImage;
                                img.onerror = null;
                            }}/>
                            <h2>{event.name}</h2>
                        </Link>
                            <h2>Date: {new Date(event.date).toLocaleDateString()}</h2>
                    </div>)}
                </div>
            }
    </>
  );
};
