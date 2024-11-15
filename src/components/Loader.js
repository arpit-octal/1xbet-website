import React from "react";
import { useContext } from "react";
import AuthProvider from "../context/AuthContext";

const Loader = () => {
  let { loader } = useContext(AuthProvider);
  return (
    <div
      className="loading-overlay"
      style={{ display: loader ? "flex" : "none" }}
      id="loading"
    >
      <div className="loading-wrap">
        <div className="loading">
          <div></div>
          <div></div>
        </div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
