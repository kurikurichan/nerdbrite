const LOAD = 'events/LOAD';
const LOAD_DATA = 'events/LOAD_DATA';
const ADD_EVENT = 'events/ADD_EVENT';

const load = list => ({
    type: LOAD,
    list
});

// for getting items needed for dropdown lists - venues & categories
const loadData = data => ({
    type: LOAD_DATA,
    data
})

const add = newEvent => ({
    type: ADD_EVENT,
    newEvent
})

export const getEvents = () => async dispatch => {

    const response = await fetch('/api/events');

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list));
    }
};

export const getForm = () => async dispatch => {

    // here we want to grab the categories & venues
    const response = await fetch('/api/events/new');

    if (response.ok) {
        const categoriesAndVenues = await response.json();
        dispatch(loadData(categoriesAndVenues));
    }
}

export const addEvent = (eventData) => async dispatch => {

    const response = await fetch('/api/events', {
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

const eventReducer = (state = {}, action) => {

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
        case ADD_EVENT:
            const newState = {};
            newState[action.newEvent.id] = action.newEvent;
            return newState;
        default:
            return state;
    }
}

export default eventReducer;
