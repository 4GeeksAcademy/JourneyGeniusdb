import React from "react";

const ItemDetails = ({ item, itemType, onClose }) => {
  if (!item) {
    return null;
  }

  const renderProperty = (key, property) => {
    // Ignorar as propriedades id e user_id
    if (key === "id" || key === "user_id") {
      return null;
    }

    if (key === "category" || key === "subcategory") {
      return (
        <span key={key}>
          <strong>{key}:</strong> {property.name}
        </span>
      );
    }

    if (typeof property === "object" && property !== null) {
      return null; // Ignorar outras propriedades de objeto aninhadas
    }

    return (
      <span key={key}>
        <strong>{key}:</strong> {property}
      </span>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "1em",
        zIndex: 1000
      }}
    >
      <h2>{itemType === "product" ? "Product Details" : "Service Details"}</h2>
      <div>
        {Object.keys(item).map(key => (
          <div key={key}>
            {renderProperty(key, item[key])}
          </div>
        ))}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ItemDetails;


