import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

import "./LoginForm.css";

function LoginForm() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  const handleDemo = (e) => {
    setCredential("Demo-lition");
    setPassword("password");
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <ul>
        {errors.map((error, idx) => (
          <li key={idx} className="errors">{error}</li>
        ))}
      </ul>
      <div className="login-field-format">
        <label className="login-label modal-text">
          Username or Email
          <input
            className="login-inputs"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
        </label>
      </div>
      <div className="login-field-format">
        <label className="login-label modal-text">
          Password
          <input
            className="login-inputs"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" className="modal-button">Log In</button>
      <div className="demo">
        <p className="modal-text">Want to try out the site without an account?</p>
        <button onClick={handleDemo} className="modal-button">Demo User</button>
      </div>
    </form>
  );
}

export default LoginForm;
