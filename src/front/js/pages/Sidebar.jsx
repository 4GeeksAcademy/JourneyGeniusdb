import React from 'react';
import './Profile.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="avatar-container">
        {/* O espaço para a foto de perfil do usuário estará aqui */}
      </div>
      <ul className="sidebar-menu">
        <li>Add a product</li>
        <li>Add a service</li>
        <li>Your Products and Services</li>
        <li>Messages</li>
        <li>Trades</li>
        <li>Wishlist</li>
        <li>Favorites</li>
      </ul>
    </div>
  );
};

export default Sidebar;
