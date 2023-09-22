import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
        <h1> Flow Tracker </h1>
        <p> GO WITH THE FLOW</p>
        <Link to="/flow">
          <button> See the flow </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;