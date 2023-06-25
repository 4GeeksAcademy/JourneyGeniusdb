import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import LoginModal from "./LoginModal.jsx";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logoutUser(() => {
      navigate("/Goodbye");
    });
  };

  // Decide o caminho com base no status de login
  const logoPath = store.isLoggedIn ? "/profile" : "/";

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        {/* Link para Home ou Perfil, dependendo se o usuário está logado */}
        <Link to={logoPath}>
          <span className="navbar-brand mb-0 h1">Logo/Name</span>
        </Link>

        {/* Link para About */}
        <Link to="/about" style={{ marginRight: "auto" }}>
          About
        </Link>

        {/* Botão de Login/Logout */}
        <div className="ml-auto">
          {!store.isLoggedIn ? (
            <button
              className="btn btn-primary"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {/* Login Modal */}
        <LoginModal
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
        />
      </div>
    </nav>
  );
};
