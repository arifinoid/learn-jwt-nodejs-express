import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";

export const Protected = () => {
  const [user] = useContext(UserContext);
  const [content, setContent] = useState("You need to login");

  useEffect(() => {
    const fetchProtectedData = async () => {
      const result = await (
        await fetch(`${process.env.REACT_APP_API_URL}/protected`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.accesstoken}`
          }
        })
      ).json();

      console.log(user);
      if (result.data) setContent(result.data);
    };

    fetchProtectedData();
  }, [user]);

  return <div>{content}</div>;
};
