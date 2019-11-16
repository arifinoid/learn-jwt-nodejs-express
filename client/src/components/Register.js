import React, { useState } from "react";
import { navigate } from "@reach/router";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await (
      await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })
    ).json();

    if (!result.error) {
      console.log(result.message);
      navigate("/");
    } else {
      console.log(result.error);
    }
  };

  const handleChange = e => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="login-input">
          <input
            type="email"
            value={email}
            onChange={handleChange}
            name="email"
            placeholder="Email"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={handleChange}
            name="password"
            placeholder="Password"
            autoComplete="current-password"
          />
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};
