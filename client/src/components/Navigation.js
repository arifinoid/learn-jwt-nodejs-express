import React from "react";
import { Link } from "@reach/router";

export const Navigation = ({ logOutCallback }) => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/protected">Protected</Link>
    </li>
    <li>
      <Link to="/register">Register</Link>
    </li>
    <li>
      <button onClick={logOutCallback}>Logout</button>
    </li>
  </ul>
);
