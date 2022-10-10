import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateEvent, getOneEvent, getForm, deleteEvent } from '../../store/events';

import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import Geocode from "react-geocode";



import '../NewEventForm/NewEventForm.css';

export default function EditEventForm({ eventLoaded, mapKey }) {

  const event = useSelector(state => state.events.event && state.events.event);
  const categoryVenues = useSelector(state => state.events && state.events);
  const user = useSelector(state => state.session.user);

  const { eventId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getOneEvent(eventId)); // should get the individual event info
  }, [dispatch, eventId]);

  const history = useHistory();


  const [venue, setVenue] = useState(event ? event.venueName : "");
  const [category, setCategory] = useState(event ? event.Category.type : "");
  const [name, setName] = useState(event ? event.name : "");
  const [date, setDate] = useState(event ? new Date(event?.date).toLocaleString('en-CA', { timeZone: 'UTC', year: "numeric", month: "numeric", day: "numeric" }) : "");
  const [capacity, setCapacity] = useState(event ? event.capacity : "");
  const [description, setDescription] = useState(event ? event.description : "");
  const [image, setImage] = useState(event ? event.image : "");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [ libraries ] = useState(['places']);


  const [errors, setErrors] = useState([]);
    // length for event description
    const [red, setRed] = useState(false);


  useEffect(() => {
    if (event) {
      setVenue(event.venueName);
      setCategory(event.Category.type);
      setName(event.name);
      setDate(new Date(event.date).toLocaleString('en-CA', { timeZone: 'UTC', year: "numeric", month: "numeric", day: "numeric" }));
      setCapacity(event.capacity);
      setDescription(event.description);
      setImage(event.image);
      setAddress(event.address);
      setLat(event.lat);
      setLng(event.lng);
    }
}, [event]);

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
      lat,
      lng
    };

    const updatedEvent = await(dispatch(updateEvent(payload, eventId)))
      .catch(async (err) => {
        const editData = await err.json();
        if (editData && editData.errors) setErrors(editData.errors);
    });

    if (updatedEvent) history.push(`/events/${eventId}`);

  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push(`/events/${eventId}`);
  }

  const handleDeleteClick = async (e) => {
    e.preventDefault(e);

    await dispatch(deleteEvent(eventId));
    history.push('/events');

  }

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // handle the text area thing
  useEffect(() => {
    if (description.length >= 200) {
      setRed(true);
    } else {
      setRed(false);
    }
  }, [description] );

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
  }, [])

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
  if (!event || !categoryVenues) return null;
  return eventLoaded && isLoaded && (
        <section className="new-event-form-section">
            {event.date ?
              <div className="event-form-container">
                <h1 id="event-title">Edit Event</h1>
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
                        {Array.isArray(categoryVenues.categories) && categoryVenues.categories.map(category =>
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
                    <div className = "errors-div">
                      <ul>
                      {errors.map((error, idx) => (
                        <li key={idx} className="errors">{error}</li>
                      ))}
                      </ul>
                    </div>
                    <div className="button-row">
                      <button type="submit" className="edit">Update Event</button>
                      <button className= "delete-button edit" onClick={handleDeleteClick}>Delete Event</button>
                      <button type="button" className="edit" onClick={handleCancelClick}>Cancel</button>
                    </div>
                  </form>
                </div> :
            <p className="loading">Form Loading...</p>
            }
        </section>
  )
}
