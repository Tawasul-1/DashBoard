// src/Style-pages/EditProfile.jsx
import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import "../Style-pages/EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "Youmna Khalil",
    email: "youmna@example.com",
    phone: "+20 123 456 7890",
    location: "Cairo, Egypt",
    bio: "Frontend Developer passionate about accessibility, performance, and great UI/UX.",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="dashboard-wrapper d-flex bg-light min-vh-100">
      <Sidebar />

      <div className="main-content flex-grow-1 p-4">
        <Container>
          <Card className="edit-profile-card shadow rounded-4 border-0 p-4">
            <div className="d-flex align-items-center mb-4">
              <FaUserEdit className="text-primary fs-4 me-2" />
              <h4 className="mb-0 fw-semibold">Edit Profile</h4>
            </div>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="rounded-3 p-2"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="rounded-3 p-2"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="rounded-3 p-2"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="rounded-3 p-2"
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      className="rounded-3 p-2"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-end">
                <div className="text-center">
                  <Button type="submit" variant="primary" className="rounded-pill px-4 py-2 mt-2">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default EditProfile;
