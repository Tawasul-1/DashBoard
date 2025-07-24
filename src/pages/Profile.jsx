// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { FaEnvelope, FaUser, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import { userService } from "../api/services/UserService";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please login again.");
          // Redirect to login after 3 seconds
          setTimeout(() => {
            logout();
            navigate("/login");
          }, 3000);
        } else {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, logout]);

  if (loading) {
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="main-content flex-grow-1 p-4">
          <Container className="py-4">
            <Row className="justify-content-center">
              <Col className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading profile...</p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="main-content flex-grow-1 p-4">
          <Container className="py-4">
            <Row className="justify-content-center">
              <Col lg={8} md={10}>
                <Card className="profile-card shadow p-4 text-center">
                  <div className="alert alert-danger">{error}</div>
                  {error.includes("session") && (
                    <p>Redirecting to login page...</p>
                  )}
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1 p-4">
        <Container className="py-4">
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="profile-card shadow p-4">
                <Row className="align-items-center">
                  <Col md={4} className="text-center mb-4 mb-md-0">
                    {profile.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt="Profile"
                        className="img-fluid rounded-circle profile-picture"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="profile-picture-placeholder">
                        <FaUser size={80} />
                      </div>
                    )}
                  </Col>
                  <Col md={8}>
                    <h3 className="fw-bold">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-muted">@{profile.username}</p>
                    <hr />
                    
                    <div className="profile-info">
                      <p>
                        <FaEnvelope className="me-2 text-primary" /> {profile.email}
                      </p>
                      {profile.phone && (
                        <p>
                          <FaPhone className="me-2 text-primary" /> {profile.phone}
                        </p>
                      )}
                      {profile.birth_date && (
                        <p>
                          <FaCalendarAlt className="me-2 text-primary" /> 
                          {new Date(profile.birth_date).toLocaleDateString()}
                        </p>
                      )}
                      {profile.address && (
                        <p>
                          <FaMapMarkerAlt className="me-2 text-primary" /> {profile.address}
                        </p>
                      )}
                    </div>
                    
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Profile;
