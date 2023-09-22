import React from "react";
import "./CSS/navbar.css"

export const Navbar = () => {
    return (
        <div>
            <div class="topnav">
                <a class="active" href="#home">Home</a>
                <a href="#news">News</a>
                <a href="#contact">Contact</a>
                <a href="#about">About</a>
            </div>
            <center>
            <h1>Kien's Amazing Page</h1>
            <h2><a href="https://www.fragrancenet.com/ni/fragrances?f=0!4U">Check out this fragrance website!</a></h2>
            </center>
        </div>
    );
    
};
 
export default Navbar;