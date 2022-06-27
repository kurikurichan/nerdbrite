const LOAD = 'events/LOAD';
const ADD_EVENT = 'events/ADD_EVENT';

const load = list => ({
    type: LOAD,
    list
});

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
        case ADD_EVENT:
            const newState = {};
            newState[action.newEvent.id] = action.newEvent;
            return newState;
        default:
            return state;
    }
}

export default eventReducer;
