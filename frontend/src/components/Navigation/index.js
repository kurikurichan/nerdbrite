import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';

import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <NavLink to="/events/new" title="Create a New Event" exact={true}><i className="fa-solid fa-plus"></i></NavLink>
        <NavLink to={`/register/${sessionUser.id}`} title="My Events"><i className="fa-solid fa-ticket-simple"></i></NavLink>
        <ProfileButton user={sessionUser} />
      </>
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <NavLink to="/signup">Sign Up</NavLink>
      </>
    );
  }

  return (
    <div id="nav-items">
      <div id= "nav-left">
        <Link exact to="/" className="nerd-logo">nerdbrite</Link>
      </div>
      <div id="nav-right">
        <NavLink to="/events" exact={true}>Events</NavLink>
        {isLoaded && sessionLinks}
      </div>
    </div>
  );
}

export default Navigation;
