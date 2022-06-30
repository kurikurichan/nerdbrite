import React, { useState } from "react";
import * as ticketActions from "../../store/registration";
import { useDispatch, useSelector } from "react-redux";

function RegisterEvent({ eventId }) {

    const user = useSelector(state => state.session.user);
    // maybe possibly want event data as well? to display

    // we also need the data of the registration we are looking at btw
    const dispatch = useDispatch();

    const [errors, setErrors] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);

    let regId;

    const handleRegister = async (e) => {

        e.preventDefault();
        setErrors([]);

        const tixData = {
            eventId,
            userId: user.id
        }

        const newReg = await dispatch(ticketActions.addEvent({ tixData }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            }
        );

        if (newReg) {
            setIsRegistered(true);
            regId = newReg.id;
        }
    };

    const handleUnregister = async(e) => {
        e.preventDefault();
        setErrors([]);

        const unregister = await dispatch(ticketActions.deleteRegistration({ regId }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            }
        );

        if (unregister) {
            setIsRegistered(false);
        }

    }

    return (
        <div className="registerModal">
            { isRegistered ?
            <>
                <h2>You are registered for this event!</h2>
                <button id="unregisterButton" onClick={handleUnregister}>Unregister</button>
            </>
            :
            <>
                <h1>Register Today!</h1>
                <div className="ticket-error">{errors.length > 0 && <p>Something went wrong</p>}</div>
                <button id="registerButton" onClick={handleRegister}>Register Now</button>
            </>}
        </div>
    );
}

export default RegisterEvent;
