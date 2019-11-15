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

  const logOutCallback = async () => {};
  useEffect(() => {}, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="App">
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
