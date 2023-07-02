import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const UserItems = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.fetchUserItems(); // Fetch user items on component mount
    }, []);

    return (
        <div>
            <h2>My Products</h2>
            <ul>
                {store.userProducts &&
                    store.userProducts.map((product) => (
                        <li key={product.id}>
                            {product.name} - Product - {product.description}
                        </li>
                    ))}
            </ul>

            <h2>My Services</h2>
            <ul>
                {store.userServices &&
                    store.userServices.map((service) => (
                        <li key={service.id}>
                            {service.name} - Service - {service.description}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default UserItems;
