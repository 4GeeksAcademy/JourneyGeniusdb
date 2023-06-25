import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ show, handleClose }) => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // Aqui, adicionar a lógica para autenticar o usuário
    // Chamando uma função actions para lidar com o login:
    actions.loginUser(email, password, navigate, handleClose);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleLogin}>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default LoginModal;
