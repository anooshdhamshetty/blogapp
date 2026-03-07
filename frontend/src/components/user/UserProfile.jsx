import React from 'react';
import { Outlet } from 'react-router-dom';

function UserProfile() {
  return (
    <div className="profile-layout">
      <Outlet />
    </div>
  );
}

export default UserProfile;