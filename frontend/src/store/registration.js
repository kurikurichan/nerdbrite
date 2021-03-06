import { csrfFetch } from './csrf';

// actions
const GET_ONE_TIX = 'registration/GET_ONE_TIX'
const GET_ALL_TIX = 'registration/GET_ALL_TIX';
const NEW_TIX = 'registration/NEW_TIX';
const DEL_TIX = 'registration/DEL_TIX';

//GET one ticket if it exists
const getOneTix = tix => ({
    type: GET_ONE_TIX,
    tix
});

// GET list of all registrations for the user
const getAllTix = tix => ({
    type: GET_ALL_TIX,
    tix
});

// POST registration - create new registration
const addNewTix = tix => ({
    type: NEW_TIX,
    tix
});

// DELETE registration
const delTix = tix => ({
    type: DEL_TIX,
    tix
});

// thunks
// get one ticket if it exists (for user & event)
export const getOneTicket = (eventId) => async dispatch => {

    const response = await csrfFetch(`/api/register/${eventId}/ticket`);

    if (response.ok) {
        const theTicket = await response.json();
        dispatch(getOneTix(theTicket));
        return theTicket;
    }
};

// get all tix for one user
export const getOneUsersTix = (userId) => async dispatch => {

    const response = await csrfFetch(`/api/register/${userId}`);

    if (response.ok) {
        const allTix = await response.json();
        dispatch(getAllTix(allTix));
        return allTix;
    }
};

// post new ticket/registration
export const addEvent = (tixData) => async dispatch => {

    const response = await csrfFetch('/api/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tixData)
    });

    if (response.ok) {
        const reg = await response.json();
        dispatch(addNewTix(reg));
        return reg;
    }
};

// Delete registration
export const deleteRegistration = (regId) => async dispatch => {

    const response = await csrfFetch(`/api/register/${regId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        dispatch(delTix(regId));
    }
};

// reducer
const registrationReducer = (state = {}, action) => {

    let newState;

    switch (action.type) {
        case GET_ONE_TIX:
            newState = {};
            // may get a null value back if the ticket doesn't exist for user
            if (action.tix) {
                newState[action.tix.id] = action.tix;
            }
            return newState;
        case GET_ALL_TIX:
            newState = {};
            action.tix.forEach(ticket => {
                newState[ticket.id] = ticket;
            });
            return newState;
        case NEW_TIX:
            newState = {};
            newState[action.tix.id] = action.tix;
            return newState;
        case DEL_TIX:
            newState = { ...state };
            delete newState[action.tix];
            return newState;
        default:
            return state;
    }
}

export default registrationReducer;
