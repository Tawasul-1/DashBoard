import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaHome, FaBell, FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { BsCollectionPlay, BsClockHistory, BsGrid } from "react-icons/bs";
import "../Style-pages/Home.css"; // هنضيف استايلات مخصصة هنا
import Sidebar from "../Components/Sidebar";
import { Link } from "react-router-dom"; // تأكدي من استيراده
import CardService from "../api/services/CardService";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token from localStorage:", token);
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([CardService.getAppStats(token)])
      .then(([statsRes]) => {
        console.log("Stats API response:", statsRes);
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
        <div className="main-content flex-grow-1 p-4">Loading...</div>
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
                <FaUserCircle size={30} />
              )}
            </NavLink>
          </div>
        </div>

        {/* Stats Cards */}

        <Row className="g-3 mb-4">
          <Col md={4}>
            <Link to="/cards" className="text-decoration-none">
              <Card className="stats-card peach">
                <Card.Body>
                  <h3>{stats ? stats.cards_count : 0}</h3>
                  <p>PECS Cards</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={4}>
            <Link to="/cat" className="text-decoration-none">
              <Card className="stats-card yellow hoverable">
                <Card.Body>
                  <h3>{stats ? stats.categories_count : 0}</h3>
                  <p>Categories</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          {/* <Col md={4}>
           <Link to="/sent" className="text-decoration-none">
            <Card className="stats-card blue-light">
              <Card.Body>
                <h3>12</h3>
                <p>Sentences</p>
              </Card.Body>
            </Card>
            </Link>
          </Col> */}

          <Col md={4}>
            <Link to="/user" className="text-decoration-none">
              <Card className="stats-card green">
                <Card.Body>
                  <h3>{stats ? stats.users_count : 0}</h3>
                  <p>Users</p>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          {/* <Col md={6}>
           <Link to="/" className="text-decoration-none">
            <Card className="stats-card blue">
              <Card.Body>
                <h3>3</h3>
                <p>Doctors</p>
              </Card.Body>
            </Card>
            </Link>
          </Col> */}
        </Row>

        {/* Manage PECS Cards */}
        {/* <h4 className="fw-bold mb-3">Manage PECS Cards</h4>
        <Row className="g-3">
          <Col xs={6} md={3}>
            <Card className="action-card yellow">
              <Card.Body>
                <img src="https://img.icons8.com/color/96/meal.png" alt="Eat" />
                <p>Eat</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="action-card blue-light">
              <Card.Body>
                <img src="https://img.icons8.com/color/96/water.png" alt="Drink" />
                <p>Drink</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="action-card green">
              <Card.Body>
                <img src="https://img.icons8.com/color/96/plus.png" alt="More" />
                <p>More</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="action-card purple">
              <Card.Body>
                <img src="https://img.icons8.com/color/96/finish-flag.png" alt="Finished" />
                <p>Finished</p>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}
      </div>
    </div>
  );
};

export default Home;
