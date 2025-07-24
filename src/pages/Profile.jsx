import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaUserEdit, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "../Style-pages/Profile.css";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const Profile = ({ user }) => {
  const defaultUser = {
    name: "Youmna Khalil",
    email: "youmna@example.com",
  };

  const profile = user || defaultUser;

  return (
    <div className="dashboard-wrapper d-flex">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        <Container className="py-4">
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="profile-card shadow p-4">
                <Row className="align-items-center">
                  
                  <Col md={8}>
                    <h3 className="fw-bold text-center text-md-start">{profile.name}</h3>
                    <hr />
                    <div className="profile-info">
                      <p>
                        <FaEnvelope className="me-2 text-primary" /> {profile.email}
                      </p>
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
