import React, { useState } from "react";
import * as ticketActions from "../../store/registration";
import { useDispatch, useSelector } from "react-redux";

function RegisterEvent({ eventId }) {

    const user = useSelector(state => state.session.user);
    // maybe possibly want event data as well? to display

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

        console.log("is anyone there");

        const newReg = await dispatch(ticketActions.addEvent({tixData}));
        console.log("newReg:", newReg)

        // const newReg = await dispatch(ticketActions.addEvent({ tixData }))
        //     .catch(async (res) => {
        //         const data = await res.json();
        //         if (data && data.errors) setErrors(data.errors);
        //     }
        // );

        if (newReg) console.log("newReg: ", newReg);
    };

    const handleUnregister = async(e) => {
        e.preventDefault();
        setErrors([]);

        // await dispatch(ticketActions.deleteRegistration({ 1 }))
        //     .catch(async (res) => {
        //         const data = await res.json();
        //         if (data && data.errors) setErrors(data.errors);
        //     }
        // );
    }

    return (
        <div className="registerModal">
            <h1>Register Today!</h1>
            {errors.length && <p>Something went wrong</p>}
            <button id="registerButton" onSubmit={handleRegister}>Register Now</button>
        </div>
    );
}

export default RegisterEvent;
