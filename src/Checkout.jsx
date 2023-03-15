/** @format */

import React, { useState } from "react";
import { saveShippingAddress } from "./services/shippingService";

const STATUS = {
  IDLE: "IDLE",
  SUBMITTING: "SUBMITTING",
  SUBMITTED: "SUBMITTED",
  COMPLETED: "COMPLETED",
};

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
  city: "",
  country: "",
};

export default function Checkout({ cart, emptyCart }) {
  const [address, setAddress] = useState(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [isTouched, setIsTouched] = useState({});

  //Derived state
  const errors = getErrors(address);
  const isvalid = Object.keys(errors).length === 0;

  function handleChange(event) {
    event.persist(); //persist event (no need on react 17 and newer)
    setAddress((curAdress) => {
      return {
        ...curAdress,
        [event.target.id]: event.target.value,
      };
    });
  }

  function handleBlur(event) {
    event.persist(); //persist event (no need on react 17 and newer)
    setIsTouched((cur) => {
      return {
        ...cur,
        [event.target.id]: true,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);
    if (isvalid) {
      try {
        await saveShippingAddress(address);
        emptyCart();
        setStatus(STATUS.COMPLETED);
      } catch (error) {
        setSaveError(error);
      }
    } else {
      setStatus(STATUS.SUBMITTED);
    }
  }
  function getErrors(address) {
    const result = {};
    if (!address.city) result.city = "*City is required";
    if (!address.country) result.country = "*Country is required";
    return result;
  }

  if (saveError) throw saveError;
  if (status === STATUS.COMPLETED) {
    return <h1>Thanks for Shopping !!</h1>;
  }
  return (
    <>
      <h1>Shipping Info</h1>

      {!isvalid && status === STATUS.SUBMITTED && (
        <div role="alert">
          <p>please fix the following errors:</p>
          <ul>
            {Object.keys(errors).map((key) => {
              return <li key={key}>{errors[key]}</li>;
            })}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            value={address.city}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(isTouched.city || status === STATUS.SUBMITTED) && errors.city}
          </p>
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            value={address.country}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="USA">USA</option>
          </select>
          <p role="alert">
            {(isTouched.country || status === STATUS.SUBMITTED) && errors.country}
          </p>
        </div>

        <div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Save Shipping Info"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
      </form>
    </>
  );
}
