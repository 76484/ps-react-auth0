import React, { useEffect, useState } from "react";

function Courses({ auth }) {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/courses", {
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
        setCourses(response.courses);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [auth]);

  return error ? (
    <p>{error}</p>
  ) : (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
}

export default Courses;
