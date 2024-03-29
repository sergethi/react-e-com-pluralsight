/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import useFetchAll from "./services/useFetchAll";
import Spinner from "./Spinner";

export default function Cart({ cart, updateQuantity }) {
  const urls = cart.map((i) => `products/${i.id}`);
  const { data: products, loading, error } = useFetchAll(urls);
  const navigate = useNavigate();

  function renderItem(itemInCart) {
    const { id, sku, quantity } = itemInCart;
    const { price, name, image, skus } = products.find(
      (p) => p.id === parseInt(id)
    );
    const { size } = skus.find((s) => s.sku === sku);

    return (
      <li key={sku} className="cart-item">
        <img src={`/images/${image}`} alt={name} />
        <div>
          <h3>{name}</h3>
          <p>${price}</p>
          <p>Size: {size}</p>
          <p>
            <select
              aria-label={`Select quantity for ${name} size ${size}`}
              onChange={(e) => updateQuantity(sku, parseInt(e.target.value))}
              value={quantity}
            >
              <option value="0">Remove</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </p>
        </div>
      </li>
    );
  }

  if (loading) return <Spinner />;
  if (error) throw error;

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <section id="cart">
      <h1>
        {totalItems
          ? `${totalItems} Item${totalItems > 1 ? "s" : ""} in Cart`
          : "Cart is empty !"}
      </h1>
      <ul>{cart.map(renderItem)}</ul>
      {cart.length > 0 && (
        <button
          className="btn btn-primary"
          onClick={() => navigate("/checkout")}
        >
          Checkout
        </button>
      )}
    </section>
  );
}
