import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Context } from "../store/appContext";

const TradeProposal = ({ show, handleClose, itemToTrade }) => {
  const { store, actions } = useContext(Context);
  const [selectedItem, setSelectedItem] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user items on component mount
  useEffect(() => {
    actions.fetchUserItems();
  }, []);

  const handleTradeProposal = (e) => {
    e.preventDefault();
    const receiverId = itemToTrade.user_id;
    actions.sendTradeProposal(selectedItem, receiverId, itemToTrade.id, message);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Trade Proposal</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleTradeProposal}>
        <Modal.Body>
          <Form.Group controlId="selectedItem">
            <Form.Label>Selected Item</Form.Label>
            <Form.Control
              as="select"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              required
            >
              <option value="">Select an item</option>
              {store.userProducts && store.userProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
              {store.userServices && store.userServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Send Proposal
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TradeProposal;
