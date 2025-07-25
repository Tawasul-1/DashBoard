import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../Style-pages/Home.css";
import Sidebar from "../Components/Sidebar";
import CardService from "../api/services/CardService";
import { useAuth } from "../context/AuthContext";
import Profile from "./Profile"; // Import the Profile component

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }
    CardService.getAppStats(token)
      .then((statsRes) => {
        setStats(statsRes.data);
      })
      .catch(() => {
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="main-content flex-grow-1 p-4 d-flex justify-content-center align-items-center">
          {/* You can use a Bootstrap spinner here for a better look */}
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper d-flex">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Dashboard</h2>
          <div className="d-flex align-items-center gap-3">
            <NavLink to={user?.avatar ? "/profile" : "/login"}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User"
                  className="rounded-circle"
                  style={{ width: 35, height: 35, objectFit: "cover" }}
                />
              ) : (
                <FaUserCircle size={30} className="text-secondary" />
              )}
            </NavLink>
          </div>
        </div>

        <Profile /> 
        
        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col md={6} sm={12}>
            <Link to="/cards" className="text-decoration-none">
              <Card className="stats-card peach">
                <Card.Body>
                  <h3>{stats ? stats.cards_count : 0}</h3>
                  <p>PECS Cards</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} sm={12}>
            <Link to="/categories" className="text-decoration-none">
              <Card className="stats-card yellow ">
                <Card.Body>
                  <h3>{stats ? stats.categories_count : 0}</h3>
                  <p>Categories</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} sm={12}>
            <Link to="/user" className="text-decoration-none">
              <Card className="stats-card green">
                <Card.Body>
                  <h3>{stats ? stats.users_count : 0}</h3>
                  <p>Users</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} sm={12}>
            <Link to="/default" className="text-decoration-none">
              <Card className="stats-card purple">
                <Card.Body>
                  <h3>{stats ? stats.default_board_cards_count : 0}</h3>
                  <p>Default Cards</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
