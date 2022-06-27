const LOAD = 'events/LOAD';

const load = list => ({
    type: LOAD,
    list
});

export const getEvents = () => async dispatch => {
    console.log("We have entered getEvents");
    const response = await fetch('/api/events');

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list));
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
        default:
            return state;
    }
}

export default eventReducer;
