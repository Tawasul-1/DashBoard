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
    phone: "+20 123 456 7890",
    location: "Cairo, Egypt",
    avatar: "https://i.pravatar.cc/150?img=32",
    bio: "Frontend Developer passionate about accessibility, performance, and great UI/UX.",
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
                  <Col md={4} className="text-center mb-4 mb-md-0">
                    <img
                      src={profile.avatar}
                      alt="User Avatar"
                      className="rounded-circle img-fluid border border-3 border-primary"
                      style={{ width: "140px", height: "140px", objectFit: "cover" }}
                    />
                    <div className="mt-3 d-md-none">
                      <Link to="/edit" id="prmary" className="btn rounded-pill px-4 w-100">
                        <FaUserEdit className="me-2" />
                        Edit Profile
                      </Link>
                    </div>
                  </Col>
                  <Col md={8}>
                    <h3 className="fw-bold text-center text-md-start">{profile.name}</h3>
                    <p className="text-muted text-center text-md-start">{profile.bio}</p>
                    <hr />
                    <div className="profile-info">
                      <p>
                        <FaEnvelope className="me-2 text-primary" /> {profile.email}
                      </p>
                      <p>
                        <FaPhone className="me-2 text-primary" /> {profile.phone}
                      </p>
                      <p>
                        <FaMapMarkerAlt className="me-2 text-primary" /> {profile.location}
                      </p>
                    </div>
                    <div className="d-none d-md-block mt-3">
                      <Link to="/edit" id="prmary" className="btn rounded-pill px-4 w-100">
                        <FaUserEdit className="me-2" />
                        Edit Profile
                      </Link>
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
