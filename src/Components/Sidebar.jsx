import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BsCollectionPlay, BsGrid } from "react-icons/bs";
import { TbCardsFilled } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { BiMenu, BiLogOut } from "react-icons/bi";
import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/config/apiClient";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout function from auth context

  const handleResize = () => {
    const mobile = window.innerWidth < 750;
    setIsMobile(mobile);
    if (!mobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Option 1: If you have a logout endpoint
      await apiClient.post("/auth/logout/");
      
      // Option 2: If you just need to clear tokens locally
      logout(); // From your auth context
      
      // Clear any stored tokens
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      
      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: still clear local data and redirect
      logout();
      navigate("/login");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      {isMobile && (
        <nav className="top-navbar">
          <div className="container-fluid d-flex justify-content-between align-items-center px-3 py-2">
            <h3 className="m-0 fw-bold">TAWASUL</h3>
            <button className="text-white btn1" onClick={toggleSidebar}>
              <BiMenu size={28} />
            </button>
          </div>
        </nav>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${
          isMobile ? (isOpen ? "mobile-show" : "mobile-hide") : "desktop-show"
        }`}
      >
        <h2 className="fw-bold mb-5">Tawasul</h2>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-3 ${isActive ? "active text-white" : ""}`
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <FaHome className="me-2" /> Home
        </NavLink>

        <NavLink
          to="/cards"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-3 ${isActive ? "active text-white" : ""}`
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <BsCollectionPlay className="me-2" /> PECS Cards
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-3 ${isActive ? "active text-white" : ""}`
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <BsGrid className="me-2" /> Categories
        </NavLink>

        <NavLink
          to="/user"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-3 ${isActive ? "active text-white" : ""}`
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <CgProfile className="me-2" /> All Users
        </NavLink>

        <NavLink
          to="/default"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-3 ${isActive ? "active text-white" : ""}`
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <TbCardsFilled className="me-2" /> Default Cards
        </NavLink>

        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="nav-link d-flex align-items-center mb-3 w-100 bg-transparent border-0"
          >
            <BiLogOut className="me-2 fs-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay only for mobile */}
      {isMobile && isOpen && (
        <div className="overlay-background" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};

export default Sidebar;
