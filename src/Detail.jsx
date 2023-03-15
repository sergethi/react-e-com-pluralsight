/** @format */

import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import useFetch from "./services/useFetch";
import Spinner from "./Spinner";

function Detail(props) {
  const [sku, setSku] = useState("");
  const { id } = useParams();
  const { data: product, isLoading, error } = useFetch(`products/${id}`);
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;
  if (!product) return <PageNotFound />;
  if (error) throw error;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <select id="size" value={sku} onChange={(e) => setSku(e.target.value)}>
        <option value="">What size ?</option>
        {product.skus.map((s) => {
          return (
            <option key={s.sku} value={s.sku}>
              {s.size}
            </option>
          );
        })}
      </select>
      <button
        disabled={!sku}
        className="btn btn-primary"
        onClick={() => {
            props.addToCart(id, sku)
            navigate("/cart")
        }}
      >
        Add to cart
      </button>
      <img src={`/images/${product.image}`} alt={product.category} />
    </div>
  );
}

export default Detail;
