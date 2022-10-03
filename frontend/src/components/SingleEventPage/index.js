import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { getMapKey, getOneEvent } from '../../store/events';
import { getOneTicket } from '../../store/registration';
import TicketModal from '../TicketModal';
import altImage from '../../alt_event_image.jpeg';

import './SingleEvent.css';
import GoogMap from '../GoogMap';

export default function SingleEventPage() {

    const event = useSelector(state => {
        return state.events.event;
    });

    const mapKey = useSelector(state => state.events.googleKey);

    // center for now - replace w single event lat & long once that's available
    const center = { lat: 48.8000, lng: 2.2900 };

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

    // get map key
    useEffect(() => {
        dispatch(getMapKey());
    }, [dispatch]);

    useEffect(() => {
        if (Object.keys(usersTicket).length > 0) {
            setRegId(+Object.keys(usersTicket)[0]);
            setIsRegistered(Object.keys(usersTicket).length > 0);
        } else {
            setIsRegistered(false);
            setRegId(null);
        }
    }, [usersTicket]);

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

    if (!event) return null;
  return (
        <div className="single-event-wrapper">
            <h1 className="event-title">{event.name}</h1>
            <div className= "event-container">
                <div className="left-side">
                    <img src={event.image || altImage} className="single-display-pic" onError={onErrorHandler} alt="some event" />
                    <ul id="single-event-text">
                        <li className="single-event-items" id="t2">{eventDate}</li>
                        <li className="single-event-items" id="t4">at the {event.Venue.name}</li>
                        <li className="single-event-items" id="t6">{event.Category.type}</li>
                        <li className="single-event-items" id="t8">by {event.User.username}</li>
                        <li className="single-event-items" id="t10">{event.capacity} can go</li>
                    </ul>
                    <div className="single-description">
                        <h2>About this Event</h2>
                        {event.description}
                    </div>
                    {currentUser && currentUser.id === event.User.id &&
                        <button className="edit-event-button" onClick={handleClick}>Edit Event</button>}
                    {currentUser && <TicketModal eventId={eventId} regId={regId} setRegId={setRegId} isRegistered={isRegistered} setIsRegistered={setIsRegistered} />}
                </div>
                <div className="right-side">
                    {typeof mapKey === 'string' && <GoogMap mapKey={mapKey} center={center}/>}
                </div>
            </div>

        </div>
    )
}
