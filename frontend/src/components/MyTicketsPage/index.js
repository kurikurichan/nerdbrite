import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOneUsersTix } from '../../store/registration';

import './MyTicketsPage.css';

export default function MyTicketsPage() {

    const tickets = useSelector(state => state.tickets);
    // tickets is Object, not array
    console.log("tickets state: ", Object.values(tickets)[0]);

    const { userId } = useParams();

    const dispatch = useDispatch();

    // short circuit format
    // const arr = tickets && Object.values(tickets);
    // const something = "user" || "";

    function mapTickets() {
      return Object.values(tickets).map(ticket =>
          <li key={ticket.id}>
            <Link to={`/events/${ticket.Event.id}`}>{ticket.Event.name}</Link>
          </li>
        )
    }

    useEffect(() => {
        dispatch(getOneUsersTix(userId))
    }, [dispatch]);

  if (!Object.keys(tickets).length) return (<p className="no-tix">Register for some events to see your tickets here!</p>);

  return (
    <div id="my-events">
      <h1>My Events</h1>
        { tickets && Object.values(tickets)["0"].Event ?
          <ul id="list-tickets">
            {mapTickets()}
          </ul>
        : <p className="loading">Loading...</p> }
      </div>
  )
}
