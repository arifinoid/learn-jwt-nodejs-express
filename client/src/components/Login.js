import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";

import { UserContext } from "../App";

export const Login = () => {
  const [user, setUser] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await (
      await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })
    ).json();

    if (result.accesstoken) {
      setUser({ accesstoken: result.accesstoken });
      navigate("/");
    } else {
      console.log(result.error);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

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
        <h2>Login</h2>
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
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};
