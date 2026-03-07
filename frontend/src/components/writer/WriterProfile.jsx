import React from 'react';
import { Outlet } from 'react-router-dom';

function WriterProfile() {
  return (
    <div className="profile-layout">
      <Outlet />
    </div>
  );
}

export default WriterProfile;