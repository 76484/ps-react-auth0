import React, { useState, useEffect } from "react";

function Profile({ auth }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    auth.getProfile((err, userProfile) => {
      if (err) {
        throw err;
      }

      setProfile(userProfile);
    });
  }, [auth]);

  return profile ? (
    <>
      <h1>Profile</h1>
      <p>{profile.nickname}</p>
      <img
        alt="profile pic"
        style={{ maxHeight: 50, maxWidth: 50 }}
        src={profile.picture}
      />
      <pre>{JSON.stringify(profile)}</pre>
    </>
  ) : null;
}

export default Profile;
