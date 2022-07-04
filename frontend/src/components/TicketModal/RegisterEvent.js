import React, { useState, useEffect } from "react";
import * as ticketActions from "../../store/registration";
import { useDispatch, useSelector } from "react-redux";

import './RegisterEvent.css';

export default function RegisterEvent({ eventId, regId, setRegId, isRegistered, setIsRegistered}) {

    const user = useSelector(state => state.session.user);
    //may possibly want eventdata btw
    const dispatch = useDispatch();

    const [errors, setErrors] = useState([]);

    const handleRegister = async (e) => {

        e.preventDefault();
        setErrors([]);

        const tixData = {
            eventId: +eventId,
            userId: user.id
        }

        const newReg = await dispatch(ticketActions.addEvent(tixData))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            }
        );

        if (newReg) {
            setIsRegistered(true);
            setRegId(newReg.id);
        }
    };

    const handleUnregister = async(e) => {
        e.preventDefault();
        setErrors([]);

        const unregister = await dispatch(ticketActions.deleteRegistration(regId ))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            }
        );

        if (unregister === undefined) {
            setIsRegistered(false);
            setRegId(null);
        }

    }

    // would be cool to put a login button here and then stay in the modal.
    if (!user) return (
        <h2>You must be logged in to register for this event.</h2>
        )
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
                <div className="errors">{errors.length > 0 && <p>Something went wrong</p>}</div>
                <button id="registerButton" onClick={handleRegister}>Register Now</button>
            </>}
        </div>
    );
}
