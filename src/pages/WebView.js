import React from "react";
import { Link } from "react-router-dom";

const WebView = () => {
  return (
    <div style={{ textAlign: "center", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" , flexDirection:'column'}} className="">
      For better resolution we can go in the mobile view
      <Link to="/" className="login-index ui-link " style={{textDecoration: "underline"}}>
        Go to Home
      </Link>
    </div>
  );
};

export default WebView;
