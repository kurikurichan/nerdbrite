import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useHistory } from 'react-router-dom';
import { getOneUsersTix } from '../../store/registration';

import './MyTicketsPage.css';

export default function MyTicketsPage() {


    const tickets = useSelector(state => state.tickets);
    const user = useSelector(state => state.session.user);

    // tickets is Object, not array
    // console.log("tickets state: ", Object.values(tickets)[0]);

    const { userId } = useParams();
    const history = useHistory();

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
      }, [dispatch, userId]);


  if (!user) history.push("/");
  if (user && user.id !== +userId) return (<p className="no-tix">You are not authorized to view this page.</p>)
  if (!Object.keys(tickets).length) return (
    <>
      <h1>My Tickets</h1>
      <p className="no-tix">Register for some events to see your tickets here!</p>
    </>
    );

  return (
    <>
      <h1>My Tickets</h1>
      <div id="my-events">
        { tickets && Object.values(tickets)["0"].Event ?
          <ul id="list-tickets">
            {mapTickets()}
          </ul>
        : <p className="loading">Loading...</p> }
      </div>
    </>
  )
}
