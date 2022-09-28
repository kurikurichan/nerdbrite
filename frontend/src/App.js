import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SignupFormPage from './components/SignUpForm';
import Events from './components/Events';
import NewEventForm from './components/NewEventForm';
import * as sessionActions from "./store/session";
import * as eventActions from "./store/events";
import bg from "./starrybackground.jpeg";

import Navigation from './components/Navigation';
import EditEventForm from './components/EditEventForm';
import SingleEventPage from './components/SingleEventPage';
import MyTicketsPage from './components/MyTicketsPage';

import './index.css';
import Footer from './Footer';
import SplashPage from './components/SplashPage/SplashPage';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [updateEvents, setUpdateEvents] = useState(false);
  const [eventLoaded, setEventLoaded] = useState(false);

  const events = useSelector(state => state.events);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(eventActions.getForm()).then(() => setUpdateEvents(true));
  }, [dispatch]);

  // update the events that are old with new ones!!!!!!
  useEffect(() => {
    // first check that the events were updated
    let filteredEvents = Object.values(events).filter(event => event.id);
    if (updateEvents && filteredEvents.length > 0) {
      // get a list of all of the events, scan them and if they are older than today,
      // send a dispatch to update those with a date 1 month ahead of today (but with the
      // same day & time)
      let today = new Date();
      for (let i = 0; i < filteredEvents.length; i++) {
        let existingDate = new Date(filteredEvents[i].date);
        if (today > existingDate) {
          let experimentalDate = new Date(today.getFullYear(), today.getMonth() + 2, existingDate.getDate());
          console.log(experimentalDate)

          const payload = {
            hostId: user.id,
            venue: filteredEvents[i].Venue.name,
            category: filteredEvents[i].categoryId,
            name: filteredEvents[i].name,
            date: experimentalDate,
            capacity: filteredEvents[i].capacity,
            image: filteredEvents[i].image,
            description: filteredEvents[i].description
          };
          console.log("should have dispatched?")

          dispatch(eventActions.updateEvent(payload, filteredEvents[i].id))
            .then(() => setEventLoaded(true));
        };
      }

      setEventLoaded(true);
    }
  }, [updateEvents]);

  return (
    <div className="wrapper">
      <header>
        <Navigation isLoaded={isLoaded} />
      </header>
      <div className="body">
        <main>
          {isLoaded && (
            <Switch>
              <Route exact path="/">
                <SplashPage />
              </Route>
              <Route path="/signup">
                <SignupFormPage />
              </Route>
              <Route exact path="/events">
                <Events />
              </Route>
              <Route exact path="/events/new">
                <NewEventForm />
              </Route>
              <Route exact path="/events/:eventId">
                <SingleEventPage />
              </Route>
              <Route exact path="/events/:eventId/edit">
                <EditEventForm eventLoaded={eventLoaded}/>
              </Route>
              <Route exact path="/register/:userId">
                <MyTicketsPage />
              </Route>
              <Route>
                <p>Page not found</p>
              </Route>
            </Switch>
          )}
          <img src={bg} className="bg" alt="bg"/>
          </main>
        </div>
      <Footer />
    </div>
  );
}

export default App;
