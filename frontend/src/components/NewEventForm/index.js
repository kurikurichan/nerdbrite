import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addEvent } from '../../store/events';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import Geocode from "react-geocode";

import './NewEventForm.css';

export default function NewEventForm({ eventLoaded, mapKey }) {

  const currentState = useSelector(state => state.events);
  const user = useSelector(state => state.session.user);

  const dispatch = useDispatch();

  const history = useHistory();

  // set default date for tomorrow
  let currentDate = new Date();
  let tomorrow = currentDate.setDate(currentDate.getDate() + 1);

  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date(tomorrow).toLocaleDateString('en-CA'));
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  // I named these weirdly so that they do not override the var names in geocode
  const [latt, setLat] = useState("");
  const [lngg, setLng] = useState("");

  // const { hostId, category, name, date, capacity, image, description, venueName, address, city, state, zipcode, lat, lng } = eventData;

  const [errors, setErrors] = useState([]);
  // length for event description
  const [red, setRed] = useState(false);

  const [ libraries ] = useState(['places']);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapKey,
    libraries// ,
    // ...otherOptions
  });

  // load Geocode shenanigans
  useEffect(() => {
    if (typeof mapKey === "string") {
      Geocode.setApiKey(mapKey);
      Geocode.setLocationType("ROOFTOP");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);

    const payload = {
      hostId: user.id,
      venueName: venue,
      category,
      name,
      date,
      capacity,
      image,
      description,
      address,
      lat: latt,
      lng: lngg
    };

    const newEvent = await(dispatch(addEvent(payload)))
      .catch(async (res) => {
        const formData = await res.json();
        if (formData && formData.errors) setErrors(formData.errors);
    });

    if (newEvent) {
      history.push(`/events/${newEvent.id}`);
    }

  };

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push('/events');
  }

  // handle the text area thing
  useEffect(() => {
    if (description.length >= 200) {
      setRed(true);
    } else {
      setRed(false);
    }
  }, [description] );

  // do address stuff
  useEffect(() => {
    if (address.length > 5) {
      // Get latitude & longitude from address.
      Geocode.fromAddress(address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
            setLat(lat);
            setLng(lng);
        },
        (error) => {
          console.error(error);
        }
      );

      // match the title thing and set it as venueName

      // either it is 4 segments long and does not start with a number
      // or > 4 segments long and is first one

      let splitted = address.split(',');
      if (splitted.length === 4 && +splitted[0].slice(0, 2) === false) setVenue(splitted[0]);
      else if (splitted.length > 4 && splitted[splitted.length - 1] === ' USA') setVenue(splitted[0]);
    }
  }, [address]);

  if (!user) history.push('/');
  if (!currentState) return null;

  return eventLoaded && isLoaded && (
    <section>
      <div className="event-form-container">
        <h1 id="event-title">Create a New Event</h1>
        <form className="create-event-form" onSubmit={handleSubmit}>
          <label className="event-label">
            Event Name
            <input
              className="event-input"
              type="text"
              placeholder="Event Name"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
          </label>
          <label className="event-label">
            Date of Event
            <input
              className="event-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              />
          </label>
          <label className="event-label">
              Address
            <Autocomplete>
              <input
                className="event-input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={(e) => setAddress(e.target.value)}
                />
            </Autocomplete>
          </label>
          <label className="event-label">
            Venue Name
            <input
              className="event-input"
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              />
          </label>
          <label className="event-label">
            Category
            <select
              className="event-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              >
              <option value="" disabled>Category</option>
              {Array.isArray(currentState.categories) && currentState.categories.map(category =>
                <option key={category.id}>{category.type}</option>
              )}
            </select>
          </label>
          <label className="event-label">
            Capacity
            <input
              className="event-input"
              type="number"
              min="0"
              max="1000000"
              value={capacity}
              maxLength={8}
              onChange={(e) => setCapacity(+e.target.value)}
              />
          </label>
          <label className="event-label" id="txtarea">
            Description
            <textarea
              className="event-txtarea"
              value={description}
              rows="5"
              cols="33"
              wrap="soft"
              maxLength={200}
              onChange={(e) => setDescription(e.target.value)}
              />
              <p className={red ? 'description red' : 'description'}>{description.length}/200</p>
          </label>
          <label className="event-label">
            Image
            <input
              className="event-input"
              type="file"
              onChange={updateFile}
              />
          </label>
          <div className="errors-div">
            <ul>
            {errors.map((error, idx) => (
              <li key={idx} className="errors">{error}</li>
            ))}
            </ul>
          </div>
          <div className="button-row">
            <button type="submit">Create new Event!</button>
            <button type="button" onClick={handleCancelClick}>Cancel</button>
          </div>
        </form>
      </div>
    </section>
  )
}
