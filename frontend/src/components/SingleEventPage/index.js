import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { getOneEvent } from '../../store/events';
import TicketModal from '../TicketModal';

import './SingleEvent.css';

export default function SingleEventPage() {

    const event = useSelector(state => {
        return state.events.event;
    });

    console.log("event: ", event);

    const currentUser = useSelector(state => {
        return state.session.user
    });

    const { eventId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const [isRegistered, setIsRegistered] = useState(false);
    const [regId, setRegId] = useState(null);

    useEffect(() => {
        dispatch(getOneEvent(+eventId));
    }, [dispatch]);

    useEffect(() => {
        setIsRegistered(event?.Tickets.id !== null);
        console.log("isRegistered in single page: ", isRegistered);
    },[isRegistered]);

    const eventDate = new Date(event?.date).toLocaleDateString('en-CA');

    const handleClick = (e) => {
        e.preventDefault();
        history.push(`/events/${eventId}/edit`);
    };

  return (
    <>
        {event ?
            <div className= "event-container">
                <h1 className="event-title">{event?.name}</h1>
                <ul>
                    <li className="single-event-items">Date: {eventDate}</li>
                    <li className="single-event-items">Venue: {event.Venue.name}</li>
                    <li className="single-event-items">Category: {event.Category.type}</li>
                    <li className="single-event-items">Event Host: {event.User.username}</li>
                    <li className="single-event-items">Event Capacity: {event.capacity}</li>
                </ul>
                {currentUser && currentUser.id === event.User.id &&
                    <button className="edit-event-button" onClick={handleClick}>Edit Event</button>}
                {currentUser && <TicketModal eventId={eventId} regId={regId} setRegId={setRegId} isRegistered={isRegistered} setIsRegistered={setIsRegistered} />}
            </div> :
        <p>Loading Event</p>
        }
    </>
    )
}
