import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { getOneEvent } from '../../store/events';
import { getOneTicket } from '../../store/registration';
import TicketModal from '../TicketModal';
import altImage from '../../alt_event_image.jpeg';

import './SingleEvent.css';

export default function SingleEventPage() {

    const event = useSelector(state => {
        return state.events.event;
    });

    const usersTicket = useSelector(state => state.tickets);
    // console.log("the whole state rn length: ", +Object.keys(usersTicket)[0]);
    //+Object.keys(usersTicket)[0]  is the id of registration if it exists

    const currentUser = useSelector(state => {
        return state.session.user
    });

    const { eventId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const [isRegistered, setIsRegistered] = useState(false);
    const [regId, setRegId] = useState(null);
    const [imgLoadError, setimgLoadError] = useState(true);

    useEffect(() => {
        dispatch(getOneEvent(+eventId));
        dispatch(getOneTicket(+eventId));
    }, [dispatch, eventId]);

    useEffect(() => {
        if (Object.keys(usersTicket).length > 0) {
            setRegId(+Object.keys(usersTicket)[0]);
            setIsRegistered(Object.keys(usersTicket).length > 0);
        } else {
            setIsRegistered(false);
            setRegId(null);
        }
    }, [usersTicket]);


    // const eventDate = new Date(event?.date).toISOString().split('T')[0];
    // console.log(eventDate);

    const newDate = event ? new Date(event.date) : new Date();
    const eventDate = newDate.toISOString().split('T')[0];

    const handleClick = (e) => {
        e.preventDefault();
        history.push(`/events/${eventId}/edit`);
    };

    const onErrorHandler = (e) => {
        if (imgLoadError) {
            setimgLoadError(false);
        };
        e.target.src= altImage;
    };

  return (
    <>
        {event ?
            <div className= "event-container">
                <h1 className="event-title">{event?.name}</h1>
                <img src={event.image} className="display-pic" onError={onErrorHandler} alt="some event" />
                <ul id="single-event-text">
                    <li className="single-event-items" id="t2">{eventDate}</li>
                    <li className="single-event-items" id="t4">at the {event.Venue.name}</li>
                    <li className="single-event-items" id="t6">{event.Category.type}</li>
                    <li className="single-event-items" id="t8">by {event.User.username}</li>
                    <li className="single-event-items" id="t10">{event.capacity} can go</li>
                </ul>
                <div className="description">
                    <h2>About this Event</h2>
                    {event.description}
                </div>
                {currentUser && currentUser.id === event.User.id &&
                    <button className="edit-event-button" onClick={handleClick}>Edit Event</button>}
                {currentUser && <TicketModal eventId={eventId} regId={regId} setRegId={setRegId} isRegistered={isRegistered} setIsRegistered={setIsRegistered} />}
            </div> :
        <p className="loading">Loading Event</p>
        }
    </>
    )
}
