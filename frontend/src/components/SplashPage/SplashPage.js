import React from 'react'
import groupPic from './dndgrouppic.jpeg';
import { Link } from 'react-router-dom';

export default function SplashPage() {

    // <h2 className="splash-text">It's a big galaxy out there...</h2>

  return (
    <div id="splash-wrapper">
        <div id="splash-pic-container">
            <img src={groupPic} className="splash-pic" alt="nerds" />
            <Link to="/events"><button className="next-event-btn">Find your next event</button></Link>
        </div>
        <div id="splash-1">
            <h1 id="welcome-title">Find your community.</h1>
            <p className="splash-body-text">Geek out with other nerds with the same interests. Find cons, tourneys, and meet-ups near you! Or create and post your own!</p>
        </div>
        <div id="splash-2">
            {/* <h2>Featured Event</h2> */}
        </div>
        <div id="splash-3">
            {/* <h2>Links to Categories here</h2> */}

        </div>

    </div>
  )
}
