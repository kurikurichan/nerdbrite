import React, { useState } from "react";
import * as ticketActions from "../../store/registration";
import { useDispatch, useSelector } from "react-redux";

function RegisterEvent() {

    const hostId = useSelector(state => state.session.user.id);

    const dispatch = useDispatch();

    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {

        e.preventDefault();
        setErrors([]);

        const tixData = {
            eventId: 1,
            userId: 1
        }

        return dispatch(ticketActions.addEvent({ tixData }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            }
        );
    };

    return (
        <div className="registerModal">
            <h1>Register Today!</h1>
            <button id="registerButton" onSubmit={handleSubmit}>Register Now</button>
        </div>
    );
}

export default RegisterEvent;
