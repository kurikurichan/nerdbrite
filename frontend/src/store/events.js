import { csrfFetch } from './csrf';

const LOAD = 'events/LOAD';
const GET_ONE = 'events/GET_ONE';
const LOAD_DATA = 'events/LOAD_DATA';
const ADD_EVENT = 'events/ADD_EVENT';
const UPDATE_EVENT = 'events/UPDATE_EVENT';
const DELETE_EVENT = 'events/DELETE_EVENT';

const GET_MAP = 'events/GET_MAP';

const load = list => ({
    type: LOAD,
    list
});

// for getting categories for dropdown lists
const loadData = data => ({
    type: LOAD_DATA,
    data
});

// get a single event
const getOne = event => ({
    type: GET_ONE,
    event
});

const add = newEvent => ({
    type: ADD_EVENT,
    newEvent
})

const edit = oldEvent => ({
    type: UPDATE_EVENT,
    oldEvent　
});

const del = eventToDelete => ({
    type: DELETE_EVENT,
    eventToDelete
});

const mapK = mapKey => ({
    type: GET_MAP,
    payload: mapKey
});

// Get all events thunk
export const getEvents = () => async dispatch => {

    const response = await fetch('/api/events');

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list));
    }
};

// Get one event
export const getOneEvent = (eventId) => async dispatch => {

    const response = await fetch(`/api/events/${eventId}`);

    if (response.ok) {
        const event = await response.json();
        dispatch(getOne(event));
    }
};

// Get form to create NEW event thunk
export const getForm = () => async dispatch => {

    // here we want to grab the categories
    const response = await fetch('/api/events/new');

    if (response.ok) {
        const categories = await response.json();
        dispatch(loadData(categories));
    }
}

// Post form to create NEW event thunk
export const addEvent = (eventData) => async dispatch => {

    const { hostId, category, name, date, capacity, image, description, venueName, address, lat, lng } = eventData;
    const formData = new FormData();
    formData.append("hostId", hostId);
    formData.append("venueName", venueName);
    formData.append("category", category);
    formData.append("name", name);
    formData.append("date", date);
    formData.append("capacity", capacity);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("lat", lat);
    formData.append("lng", lng);


    console.log(formData);


    // single file image
    if (image) formData.append("image", image);

    const response = await csrfFetch('/api/events', {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        body: formData
    });

    if (response.ok) {
        const event = await response.json();
        dispatch(add(event));
        return event;
    }
};

// Put form to update existing event thunk
export const updateEvent = (eventToUpdate, eventId) => async dispatch => {

    const { hostId, category, name, date, capacity, image, description, venueName, address, lat, lng } = eventToUpdate;
    const formData = new FormData();
    formData.append("hostId", hostId);
    formData.append("venueName", venueName);
    formData.append("category", category);
    formData.append("name", name);
    formData.append("date", date);
    formData.append("capacity", capacity);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("lat", lat);
    formData.append("lng", lng);

    // single file image
    if (image) formData.append("image", image);

    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        body: formData
    });

    if (response.ok) {
        const event = await response.json();
        dispatch(edit(event));
        return event;
    }
};

// Delete existing event, thunk
export const deleteEvent = (eventId) => async dispatch => {

    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        dispatch(del(eventId));
    }
};

// get googs map key
export const getMapKey = () => async dispatch => {

    const response = await csrfFetch('/api/events/mapKey', {
        method: "GET"
    });

    if (response.ok) {
        const kagi = await response.json();
        dispatch(mapK(kagi));
    }
}

const eventReducer = (state = {}, action) => {

    let newState;
    switch (action.type) {
        case LOAD:
            const allEvents = {};
            action.list.forEach(event => {
                allEvents[event.id] = event;
            });
            return {
                ...allEvents
            };
        case LOAD_DATA:
            const allData = {categories: []};
            action.data.forEach(category => {
                allData.categories[category.id] = category
            });
            return {
                ...state,
                ...allData
            }
        case GET_ONE:
            return {...state, event: action.event}
        case ADD_EVENT:
            newState = {...state};
            newState[action.newEvent.id] = action.newEvent;
            return newState;
        case UPDATE_EVENT:
            newState = {...state};
            newState[action.oldEvent.id] = action.oldEvent;
            return newState;
        case DELETE_EVENT:
            newState = { ...state };
            delete newState[action.eventToDelete];
            return newState;
        case GET_MAP:
            return {...state, googleKey: action.payload};

        default:
            return state;
    }
}

export default eventReducer;
