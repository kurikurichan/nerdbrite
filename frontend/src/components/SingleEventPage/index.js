import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { getOneEvent } from '../../store/events';
import TicketModal from '../TicketModal';

import './SingleEvent.css';

export default function SingleEventPage() {

    const { eventId } = useParams();
    const history = useHistory();

    const event = useSelector(state => {
        return state.events.event;
    });

    const currentUser = useSelector(state => {
        return state.session.user
    });

    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        history.push(`/events/${eventId}/edit`);
    };

    // const registerClick = (e) => {
    //     // e.preventDefault();
    //     <TicketModal eventId={eventId} />
    // }



    useEffect(() => {
        dispatch(getOneEvent(+eventId));
    }, [dispatch]);

    const eventDate = new Date(event?.date).toLocaleDateString('en-CA');


  return (
    <>
        {event ?
            <div className= "event-container">
                <h1 className="event-title">{event?.name}</h1>
                <ul>
                    <li>Date: {eventDate}</li>
                    <li>Venue: {event.Venue.name}</li>
                    <li>Category: {event.Category.type}</li>
                    <li>Event Host: {event.User.username}</li>
                    <li>Event Capacity: {event.capacity}</li>
                </ul>
                {currentUser.id === event.User.id &&
                    <button className="edit-event-button" onClick={handleClick}>Edit Event</button>}
                {currentUser && <TicketModal eventId={eventId} />}
            </div> :
        <p>Loading Event</p>
        }
    </>
    )
}
