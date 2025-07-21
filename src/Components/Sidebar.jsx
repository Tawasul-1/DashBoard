import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BsCollectionPlay, BsGrid } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { BiMenu } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import "./Sidebar.css";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
  const [isOpen, setIsOpen] = useState(false);

  const handleResize = () => {
    const mobile = window.innerWidth < 750;
    setIsMobile(mobile);
    if (!mobile) {
      setIsOpen(false); // ما يحتاجش يظهر overlay في اللابتوب
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
        <h2 className="fw-bold mb-5 ">Tawasul</h2>

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
          to="/cat"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-3 ${isActive ? "active text-white" : ""}`
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <BsGrid className="me-2" /> Categories
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center mb-3 ${isActive ? "active text-white" : ""}`
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <CgProfile className="me-2" /> Profile
        </NavLink>
        <div className="mt-auto">
          <NavLink to="/logout" className="nav-link d-flex align-items-center mb-3">
            <BiLogOut className="me-2 fs-5" />
            Logout
          </NavLink>
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
