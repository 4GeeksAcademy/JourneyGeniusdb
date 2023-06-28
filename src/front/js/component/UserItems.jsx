import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const UserItems = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    // Chama a função que busca os produtos e serviços criados pelo usuário
    actions.getUserItems();
  }, []);

  return (
    <div>
      <h2>My Items</h2>
      <h3>Products:</h3>
      <ul>
        {store.products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
      <h3>Services:</h3>
      <ul>
        {store.services.map((service) => (
          <li key={service.id}>{service.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserItems;
