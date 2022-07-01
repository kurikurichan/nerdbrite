import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { getOneEvent } from '../../store/events';
import { getOneTicket } from '../../store/registration';
import TicketModal from '../TicketModal';

import './SingleEvent.css';

export default function SingleEventPage() {

    const event = useSelector(state => {
        return state.events.event;
    });

    const usersTicket = useSelector(state => state.tickets);
    console.log("the whole state rn length: ", +Object.keys(usersTicket)[0]);
    //+Object.keys(usersTicket)[0]  is the id of registration if it exists

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
        dispatch(getOneTicket(+eventId));
    }, [dispatch]);

    useEffect(() => {
        if (Object.keys(usersTicket).length > 0) {
            console.log("regId has a numeric value");
            setRegId(+Object.keys(usersTicket)[0]);
            setIsRegistered(Object.keys(usersTicket).length > 0);
        } else {
            setIsRegistered(false);
            setRegId(null);
        }
        console.log("isRegistered in single page: ", isRegistered);
        console.log("regId from singleeventpage: ", regId);
    });

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
        <p className="loading">Loading Event</p>
        }
    </>
    )
}
