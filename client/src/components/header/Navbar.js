import React from "react";
import "./Navbar.css"; 
import amazonLogo from "../../amazon-logo.png";
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import { NavLink } from "react-router-dom";
const Navbar = () => {
    return (
        <header>
            <nav>
                <div className="left">
                    <div className="navlogo">
                        <NavLink to="/">
                            <img src={amazonLogo} alt="Amazon Logo"/>
                        </NavLink>
                    </div>
                    <div className="nav_searchbar">
                        <input type="text" name="" id="" placeholder="Search Amazon.in"/>
                        <div className="search_icon">
                            <SearchIcon id="search"/>
                        </div>

                    </div>
                </div>

                <div className="right">
                    <div className="nav_btn">
                        <NavLink to="/login">Sign In</NavLink>
                    </div>
                    <div className="cart_btn">
                        <Badge badgeContent={4} color="primary">
                            <ShoppingCartIcon id="icon"/>
                            </Badge>
                            <p>Cart</p>
                    </div>
                    <Avatar className="avtar"/>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;