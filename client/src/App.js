import React, { useEffect, useState, createContext } from "react";
import { Router, navigate } from "@reach/router";

import { Navigation } from "./components/Navigation";
import { Login } from "./components/Login";
import { Content } from "./components/Content";
import { Protected } from "./components/Protected";
import { Register } from "./components/Register";

export const UserContext = createContext([]);

const App = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const logOutCallback = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });

    setUser({});
    navigate("/");
  };

  useEffect(() => {
    const checkRefreshToken = async () => {
      const result = await (
        await fetch(`${process.env.REACT_APP_API_URL}/refresh_token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        })
      ).json();

      setUser({ accesstoken: result.accesstoken });
      setLoading(false);
    };
    checkRefreshToken();
  }, []);

  if (loading)
    return (
      <div className="app">
        <h1>loading...</h1>
      </div>
    );

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="app">
        <Navigation logOutCallback={logOutCallback} />
        <Router>
          <Login path="login" />
          <Register path="register" />
          <Protected path="protected" />
          <Content path="/" />
        </Router>
      </div>
    </UserContext.Provider>
  );
};

export default App;
