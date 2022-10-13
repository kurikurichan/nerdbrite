import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { getMapKey, getOneEvent } from '../../store/events';
import { getOneTicket } from '../../store/registration';
import TicketModal from '../TicketModal';
import altImage from '../../alt_event_image.jpeg';

import './SingleEvent.css';
import GoogMap from '../GoogMap';
import Loading from '../404/Loading';

export default function SingleEventPage() {

    const event = useSelector(state => {
        return state.events.event;
    });

    const mapKey = useSelector(state => state.events.googleKey);

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
    // latitude and longitude for map
    const [center, setCent] = useState({lat: 39.9931438, lng: 74.78793929999999})

    useEffect(() => {
        dispatch(getOneEvent(+eventId));
        dispatch(getOneTicket(+eventId));
    }, [dispatch, eventId]);

    // update center coordinates
    useEffect(() => {
        if (event && Object.keys(event).length > 0) setCent({ lat: +event.lat, lng: +event.lng})
    }, [event]);

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

    //  get and format long date
    const formatDate = () => {
        const dateToFormat = new Date(event.date);
        const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ]
        return weekdays[dateToFormat.getDay()] + ", " +
        dateToFormat.toLocaleDateString('en-CA', {
            dateStyle: "long"
        });
    };

    if (!event || Object.keys(event).length === 0) return <Loading />;
  return (
        <div className="single-event-wrapper">
            <h1 className="event-title">{event.name}</h1>
            <div className= "event-container">
                <div className="left-side">
                    <img src={event.image || altImage} className="single-display-pic" onError={onErrorHandler} alt="some event" />
                    <ul id="single-event-text">
                        <li className="single-event-items" id="t2">{eventDate}</li>
                        <li className="single-event-items" id="t4">at the {event.venueName}</li>
                        <li className="single-event-items" id="t6">{event.Category.type}</li>
                        <li className="single-event-items" id="t8">by {event.User.username}</li>
                        <li className="single-event-items" id="t10">{event.capacity} can go</li>
                    </ul>
                    <div className="single-description">
                        <h2><i className="fa-solid fa-star" style={{marginRight: "5px"}}></i>About this Event</h2>
                        {event.description}
                    </div>
                    {currentUser && currentUser.id === event.User.id &&
                        <button className="edit-event-button" onClick={handleClick}>Edit Event</button>}
                    {currentUser && <TicketModal eventId={eventId} regId={regId} setRegId={setRegId} isRegistered={isRegistered} setIsRegistered={setIsRegistered} />}
                </div>
                <div className="right-side">
                    <h2><i className="fa-regular fa-calendar"  style={{marginRight: "5px"}}></i>Date and time:</h2>
                    <p>{formatDate()}</p>
                    <h2><i className="fa-solid fa-location-dot" style={{marginRight: "5px"}}></i>Location:</h2>
                    <p style={{fontWeight: "bold"}}>{event.venueName}</p>
                    <p>{event.address}</p>
                    {typeof mapKey === 'string' && <GoogMap mapKey={mapKey} center={center} />}
                </div>
            </div>

        </div>
    )
}
