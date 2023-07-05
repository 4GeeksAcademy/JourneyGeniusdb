import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Modal, Button, Form } from "react-bootstrap";

const TradeProposal = ({ show, handleClose, itemToTrade }) => {
    const { store, actions } = useContext(Context);
    const [selectedItem, setSelectedItem] = useState("");
    const [tradeMessage, setTradeMessage] = useState("");

    const handleTradeProposal = (e) => {
        e.preventDefault();
        actions.createTrade(itemToTrade, selectedItem, tradeMessage);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Trade Proposal</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleTradeProposal}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="item" className="form-label">
                            Select your item for trade
                        </label>
                        <select
                            className="form-control"
                            id="item"
                            value={selectedItem}
                            onChange={(e) => setSelectedItem(e.target.value)}
                        >
                            <option value="">Select Item</option>
                            {store.userProducts &&
                                store.userProducts.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - Product
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">
                            Trade message (optional)
                        </label>
                        <textarea
                            className="form-control"
                            id="message"
                            value={tradeMessage}
                            onChange={(e) => setTradeMessage(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Propose Trade
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TradeProposal;
