import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import SignupFormPage from './components/SignUpForm';
import Events from './components/Events';
import NewEventForm from './components/NewEventForm';
import * as sessionActions from "./store/session";

import Navigation from './components/Navigation';
import EditEventForm from './components/EditEventForm';
import SingleEventPage from './components/SingleEventPage';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <h1>splash page welcome</h1>
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/api/events">
            <Events />
          </Route>
          <Route exact path="/api/events/new">
            <NewEventForm />
          </Route>
          <Route exact path="/api/events/:eventId">
            <SingleEventPage />
          </Route>
          <Route exact path="/api/events/:eventId/edit">
            <EditEventForm />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
