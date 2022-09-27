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

    console.log(events);

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

    if (Object.values(events).length === 0) return null;
  return (
    <>
        <h1 id="events-title">Events</h1>
        <div id="event-card-container">
            {Object.values(events).map((event, i) =>
            <div key={i} className="event-card">
                <div className="top-half">
                    <Link to={`/events/${event.id}`}>
                        <img src={event.image} className="card-pic" onError={onErrorHandler} alt="event"/>
                    </Link>
                </div>
                <div className="bottom-half">
                    <Link to={`/events/${event.id}`}>
                        <p className="cardTitle">{event.name}</p>
                    </Link>
                    <p className="cardDate">
                        {new Date(event.date).toLocaleString('en-US', { timeZone: 'UTC', year: "numeric", month: "numeric", day: "numeric" })}
                    </p>
                    <p className="cardVenue">{event.Venue.name}</p>
                    <p className="cardHost">{event.User.username}</p>
                </div>
            </div>)}
        </div>
    </>
  );
};
