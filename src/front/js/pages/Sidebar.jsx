import React from 'react';
import './Profile.css'; 

const Sidebar = ({ onMenuSelect }) => {
  return (
    <div className="sidebar">
      <div className="avatar-container">
        {/* O espaço para a foto de perfil do usuário estará aqui */}
      </div>
      <ul className="sidebar-menu">
         {/* Chama a função de callback ao clicar em uma opção de menu */}
         <li onClick={() => onMenuSelect('addProduct')}>Add a product</li>
        {/* Adicionaremos o evento onClick para as outras opções à medida que forem criadas */}
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
