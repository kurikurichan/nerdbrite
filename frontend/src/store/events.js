import { csrfFetch } from './csrf';

const LOAD = 'events/LOAD';
const GET_ONE = 'events/GET_ONE';
const LOAD_DATA = 'events/LOAD_DATA';
// const LOAD_EDIT_DATA = 'events/LOAD_EDIT_DATA';
const ADD_EVENT = 'events/ADD_EVENT';
const UPDATE_EVENT = 'events/UPDATE_EVENT';
const DELETE_EVENT = 'events/DELETE_EVENT';

const load = list => ({
    type: LOAD,
    list
});

// for getting items needed for dropdown lists - venues & categories
const loadData = data => ({
    type: LOAD_DATA,
    data
})

// get a single event
const getOne = event => ({
    type: GET_ONE,
    event
})

// same as loadData but we are also grabbing the existing event info
// const loadEditData = data => ({
//     type: LOAD_EDIT_DATA,
//     data
// });

const add = newEvent => ({
    type: ADD_EVENT,
    newEvent
})

const edit = oldEvent => ({
    type: UPDATE_EVENT,
    oldEvent　
})

const del = eventToDelete => ({
    type: DELETE_EVENT,
    eventToDelete
})

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

    // here we want to grab the categories & venues
    const response = await fetch('/api/events/new');

    if (response.ok) {
        const categoriesAndVenues = await response.json();
        dispatch(loadData(categoriesAndVenues));
    }
}

// Post form to create NEW event thunk
export const addEvent = (eventData) => async dispatch => {

    const response = await csrfFetch('/api/events', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
    });

    if (response.ok) {
        const event = await response.json();
        dispatch(add(event));
        return event;
    }
};

// GET edit form with existing single event information
export const getEditForm = (eventId) => async dispatch => {

    // here we want to grab the categories, venues, & edit
    const response = await csrfFetch(`/api/events/${eventId}/edit`);

    if (response.ok) {
        const allFormData = await response.json();
        dispatch(loadData(allFormData));
    }
}

// Put form to update existing event thunk
export const updateEvent = (eventToUpdate, eventId) => async dispatch => {

    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(eventToUpdate)
    });

    if (response.ok) {
        const event = await response.json();
        dispatch(edit(event));
        return event;
    }
};

// Delete existing event, thunk
export const deleteEvent = (eventToDelete, eventId) => async dispatch => {

    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(eventToDelete)
    });

    if (response.ok) { // uhhh verify if this works since I didn't do a res.json on the backend
        const event = await response.json();
        dispatch(del(event));
        return event;
    }
};

const eventReducer = (state = {}, action) => {

    let newState;
    switch (action.type) {
        case LOAD:
            const allEvents = {};
            action.list.forEach(event => {
                allEvents[event.id] = event;
            });
            return {
                ...state,
                ...allEvents
            };
        case LOAD_DATA:
            const allData = {venues: [], categories: []};
            action.data.venues.forEach(venue => {
                allData.venues[venue.id] = venue
            });
            action.data.categories.forEach(category => {
                allData.categories[category.id] = category
            });
            return {
                ...state,
                ...allData
            }
        case GET_ONE:
            newState = { ...state };
            newState.event = action.event;
            return newState;
        case ADD_EVENT:
            newState = {};
            newState[action.newEvent.id] = action.newEvent;
            return newState;
        case UPDATE_EVENT:
            newState = {};
            newState[action.oldEvent.id] = action.oldEvent;
            return newState;
        case DELETE_EVENT:
            newState = { ...state };
            delete newState[action.eventToDelete];
            return newState;

        default:
            return state;
    }
}

export default eventReducer;
