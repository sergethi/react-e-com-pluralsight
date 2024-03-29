/** @format */

import React from "react";
import { useState } from "react";
import useFetch from "./services/useFetch";
import Spinner from "./Spinner";
import { Link, useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";

export default function Products() {
  const [size, setSize] = useState("");
  const {category} = useParams();

  const {data: products, error, isLoading} = useFetch("products?category=" + category)

  function renderProduct(p) {
    return (
      <div key={p.id} className="product">
        <Link to={`/${category}/${p.id}`}>
          <img src={`/images/${p.image}`} alt={p.name} />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </Link>
      </div>
    );
  }

  const filteredProducts = size
    ? products.filter((item) =>
        item.skus.find((element) => element.size === parseInt(size))
      )
    : products;

  if (error) throw error;
  if (isLoading) return <Spinner />
  if (products.length === 0) return <PageNotFound />

  return (
    <>
      <div className="content">
        <main>
          <section id="filters">
            <label htmlFor="size">Filter by Size:</label>{" "}
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">All sizes</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
            {size && <h2>Found {filteredProducts.length} item(s)</h2>}
          </section>
          <section id="products">{filteredProducts.map(renderProduct)}</section>
        </main>
      </div>
    </>
  );
}
