import React, { useState } from "react";
import "./Navbar.css"; 
import amazonLogo from "../../amazon-logo.png";
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser, isAuthenticated, logout } from "../../services/api";

const Navbar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const cartCount = useSelector(state => state.cart?.cartCount || 0);
    const user = getUser();
    const authenticated = isAuthenticated();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout();
    };

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
                        <input 
                            type="text" 
                            placeholder="Search Amazon.in"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleSearch}
                        />
                        <div className="search_icon">
                            <SearchIcon id="search" onClick={() => {
                                if (searchQuery.trim()) {
                                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                }
                            }} style={{ cursor: 'pointer' }}/>
                        </div>
                    </div>
                </div>

                <div className="right">
                    {authenticated ? (
                        <>
                            <div className="nav_btn">
                                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '12px', color: '#666' }}>Hello, {user?.name?.split(' ')[0]}</div>
                                    <div onClick={handleLogout} style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>
                                        Sign Out
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="nav_btn">
                            <NavLink to="/login">Sign In</NavLink>
                        </div>
                    )}
                    
                    <div className="cart_btn">
                        <NavLink to="/cart" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                            <Badge badgeContent={cartCount} color="primary">
                                <ShoppingCartIcon id="icon"/>
                            </Badge>
                            <p style={{ margin: '0 0 0 5px' }}>Cart</p>
                        </NavLink>
                    </div>
                    <Avatar className="avtar">{user ? user.name.charAt(0).toUpperCase() : 'U'}</Avatar>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;