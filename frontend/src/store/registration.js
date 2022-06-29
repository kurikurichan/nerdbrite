import { csrfFetch } from './csrf';

// actions
const GET_ALL_TIX = 'registration/GET_ALL_TIX';
const NEW_TIX = 'registration/NEW_TIX';
const DEL_TIX = 'registration/DEL_TIX';

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
// get all tix for one user
export const getOneUsersTix = (userId) => async dispatch => {

    const response = await csrfFetch(`/api/registration/${userId}`);

    if (response.ok) {
        const allTix = await response.json();
        dispatch(getAllTix(allTix));
    }
};

// post new ticket/registration
export const addEvent = (tixData) => async dispatch => {

    const response = await csrfFetch('/api/registration', {
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
export const deleteRegistration = (regToDelete, regId) => async dispatch => {

    const response = await csrfFetch(`/api/registration/${regId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(regToDelete)
    });

    if (response.ok) { // uhhh verify if this works since I didn't do a res.json on the backend
        const reg = await response.json();
        dispatch(delTix(reg));
        return reg;
    }
};

// reducer
const registrationReducer = (state = {}, action) => {

    let newState;

    switch (action.type) {
        case GET_ALL_TIX:
            newState = {};
            action.tix.forEach(ticket => {
                newState[ticket.id] = ticket;
            });
            return {
                ...state,
                ...newState
            };
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
