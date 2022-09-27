import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';

import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <div className="button-container">
      <div className="profile-button" onClick={openMenu}>
        <i className="fas fa-solid fa-circle-user" />
        <p style={{fontSize: "13px", fontWeight: "500", marginLeft: "5px"}}>{user.email}</p>
        <i className="fa-solid fa-angle-down" style={{fontSize: "13px", marginLeft: "5px"}}></i>
      </div>
      {showMenu && (
        <ul className="profile-dropdown">
          <li>{user.username}</li>
          <li>{user.email}</li>
          <button onClick={logout} id="logout-button">Log Out</button>
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
