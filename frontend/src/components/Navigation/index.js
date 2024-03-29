import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';

import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <NavLink to="/events" className="navblocks" activeClassName='active'>
          <i className="fa-solid fa-champagne-glasses"></i>
          <p>Events</p>
        </NavLink>
        <NavLink to="/events/new" title="Create a New Event" className="navblocks" activeClassName='active'>
          <i className="fa-solid fa-plus"></i>
          <p>Create an event</p>
        </NavLink>
        <NavLink to={`/register/${sessionUser.id}`} title="My Events" className="navblocks" activeClassName='active'>
          <i className="fa-solid fa-ticket-simple"></i>
          <p>Tickets</p>
        </NavLink>
        <ProfileButton user={sessionUser} />
      </>
    );
  } else {
    sessionLinks = (
      <div className="session-links">
        <NavLink to="/events">
          <p>Events</p>
        </NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
        <LoginFormModal />
      </div>
    );
  }

  return (
    <div id="nav-items">
      <div id= "nav-left">
        <Link to="/" className="nerd-logo">nerdbrite</Link>
      </div>
      <div id="nav-right">
        {isLoaded && sessionLinks}
      </div>
    </div>
  );
}

export default Navigation;
