import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

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

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [eventLoaded, setEventLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(eventActions.getForm()).then(() => setEventLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    document.title = "nerdbrite";
  }, []);


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
                <h1 id="welcome-title">Welcome to nerdbrite!</h1>
                <h2 className="splash-text">It's a big galaxy out there...</h2>
                <p className="splash-body-text">Find your adventure today!</p>
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
