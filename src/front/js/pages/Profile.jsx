import React from 'react';
import Sidebar from './Sidebar.jsx';

const Profile = () => {
  return (
    <div className="profile-container">
     <Sidebar />
      <div className="content-area">
        {/* O conteúdo da área da direita será renderizado aqui */}
      </div>
    </div>
  );
};

export default Profile;
