import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOneUsersTix } from '../../store/registration';

export default function MyTicketsPage() {

    const tickets = useSelector(state => state.tickets);
    console.log("tickets state: ", tickets);

    console.log("typeof tickets: ", Array.isArray(tickets)) // so state.tickets is an object

    const { userId } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOneUsersTix(userId))
    }, [dispatch]);

  return (
    <>
      <h1>My Events</h1>
        { tickets ?
          <ul id="list-tickets">
            {Object.values(tickets).map(ticket =>
              <li key={ticket.id}><Link to={`/events/${ticket.Event.id}`}>{ticket.Event.name}</Link></li>)}
          </ul>
        : <p>Loading...</p> }
      </>
  )
}


//pesticide gogole chrome
