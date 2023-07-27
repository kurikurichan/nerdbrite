import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

import "./LoginForm.css";

function LoginForm({ setShowModal }) {
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

  const handleDemo = async (e) => {
    e.preventDefault();
    setErrors([]);
    await setCredential("Demo-lition");
    await setPassword("password");
    document.getElementsByClassName("login-button")[0].click();
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <p id="close" onClick={() => setShowModal(false)}>x</p>
      <h1 className="nerdbrite">nerdbrite</h1>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx} className="errors">{error}</li>
        ))}
      </ul>
      <label className="login-label modal-text">
        <i className="fa-solid fa-user"></i>
        <input
          className="login-inputs"
          placeholder="Email"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
        />
      </label>
      <label className="login-label modal-text">
        <i className="fa-solid fa-lock"></i>
        <input
          className="login-inputs"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit" className="login-button">Log In</button>
      <div className="demo">
        <p>Want to try out the site without an account?</p>
        <p onClick={handleDemo} className="demo-button" style={{fontWeight: "bold"}}>Demo User</p>
      </div>
    </form>
  );
}

export default LoginForm;
