import React, { useState } from 'react'
import Logo from "../assets/logo.png";
import Menu from "../assets/menu.png";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={Logo} alt="the logo"/>
        <div className="hiddenLinks">
          <Link to="/"> Home </Link>
          <Link to="/flow"> Flow </Link>
        </div>
      </div>
      <div className="rightSide">
        <Link to="/"> Home </Link>
        <Link to="/flow"> Flow </Link>
        <button onClick={toggleNavbar}>
          <img src={Menu} alt="a hamburger menu"/>
        </button>
      </div>
    </div>
  );
}

export default Navbar;