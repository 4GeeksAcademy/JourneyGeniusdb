import React from "react";
import "./Profile.css";

const Sidebar = ({ onMenuSelect }) => {
  return (
    <div className="sidebar">
      <div className="avatar-container">
        {/* O espaço para a foto de perfil do usuário estará aqui */}
      </div>
      <ul className="sidebar-menu">
        {/* Chama a função de callback ao clicar em uma opção de menu */}
        <li onClick={() => onMenuSelect("addProduct")}>Add a product</li>
        <li onClick={() => onMenuSelect("addService")}>Add a service</li>
        <li onClick={() => onMenuSelect("search")}>Search</li>
        <li onClick={() => onMenuSelect("userItems")}>My Products / Services</li>
        {/* Adicionar o evento onClick para as outras opções à medida que forem criadas */}
        
        <li>Trades</li>
        <li>Wishlist</li>
        <li>Favorites</li>
      </ul>
    </div>
  );
};

export default Sidebar;
