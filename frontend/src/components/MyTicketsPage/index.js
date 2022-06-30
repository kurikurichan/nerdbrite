import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOneUsersTix } from '../../store/registration';

export default function MyTicketsPage() {

    const tickets = useSelector(state => state.tickets);

    const { userId } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOneUsersTix(userId))
    }, [dispatch]);

  return (
    <div>
        <h1>My Events</h1>
        <ul id="list-tickets">
            {Object.values(tickets).map(ticket =>
                <li key={ticket.id}><Link to={`/events/${ticket.Event.id}`}>{ticket.Event.name}</Link></li>)}
        </ul>
    </div>
  )
}
