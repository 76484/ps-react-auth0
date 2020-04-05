import React, { useEffect, useState } from "react";

function Private({ auth }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/private", {
      headers: {
        Authorization: `Bearer ${auth.getAccessToken()}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((response) => {
        setMessage(response.message);
      })
      .catch((err) => {
        setMessage(err.message);
      });
  }, []);

  return <p>{message}</p>;
}

export default Private;
