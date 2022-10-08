import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvents } from '../../store/events';
import './events.css';

import altImage from './alt_event_image.jpeg';

export default function Events() {

    const events = useSelector(state => {
        return state.events;
    });

    let filteredEvents = Object.values(events).filter(event => event.id);

    const dispatch = useDispatch();

    const [imgLoadError, setimgLoadError] = useState(true);

    const onErrorHandler = (e) => {
        if (imgLoadError) {
            setimgLoadError(false);
        };
        e.target.src= altImage;
    };


    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    if (filteredEvents === 0) return null;
  return (
    <>
        <h1 id="events-title">Events</h1>
        <div id="event-card-container">
            {Object.values(filteredEvents).map((event, i) =>
            <div key={i} className="event-card">
                <div className="top-half">
                    <Link to={`/events/${event.id}`}>
                        <img src={event.image || altImage} className="card-pic" onError={onErrorHandler} alt="event"/>
                    </Link>
                </div>
                <div className="bottom-half">
                    <Link to={`/events/${event.id}`}>
                        <p className="cardTitle">{event.name}</p>
                    </Link>
                    <p className="cardDate">
                        {new Date(event.date).toLocaleString('en-US', { timeZone: 'UTC', year: "numeric", month: "numeric", day: "numeric" })}
                    </p>
                    <p className="cardVenue">{event.venueName}</p>
                    <p className="cardHost">{event.User.username}</p>
                </div>
            </div>)}
        </div>
    </>
  );
};
