/** @format */

import React from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import Products from "./Products";
import { Routes, Route} from "react-router-dom"
import Detail from "./Detail";
import Cart from "./Cart";
import { useState } from "react";
import { useEffect } from "react";
import Checkout from "./Checkout";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) ?? [];
    } catch {
      console.error("The cart could not be parsed in JSON.")
      return [];
    }
  });

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  function addToCart(id, sku){
    setCart((items) => {
      const itemInCart = items.find(item => item.sku === sku);
      //if item exist in cart increase the quantity
      if (itemInCart) {
        return items.map((item) => 
          item.sku === sku ? { ...item, quantity: item.quantity + 1}:item
        );
      }else{
        return [...items, {id, sku, quantity: 1}]
      }
    })
  }
  function updateQuantity(sku, quantity){
    setCart((items) => {
      //remove item from cart
      if (quantity === 0){
        return items.filter((item) => item.sku !== sku);
      }
      //update item in cart
      return items.map((item) => (
        item.sku === sku ? { ...item, quantity} : item
      ));
    });
  }
  function emptyCart(){
    setCart([]);
  }

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={ <h1>Welcome to Carved Rock Fitness</h1>} />
            <Route path="/:category" element={ <Products />} />
            <Route path="/:category/:id" element={<Detail addToCart={addToCart} />}/>
            <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity}/>}/>
            <Route path="/checkout" element={<Checkout cart={cart} emptyCart={emptyCart} />}/>

          </Routes>
         
        </main>
      </div>
      <Footer />
    </>
  );
}
