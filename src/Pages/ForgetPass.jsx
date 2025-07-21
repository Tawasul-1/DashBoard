import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../Style-pages/Login.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password email:", email);
    setSubmitted(true);
    // You can add API call here to handle reset request
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow rounded-4 p-4">
              <h3 className="text-center mb-4">Forgot Password</h3>
              {submitted ? (
                <Alert variant="success" className="text-center">
                  If this email exists, a reset link has been sent.
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      className="p-2"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 rounded-3"
                  >
                    Send Reset Link
                  </Button>
                </Form>
              )}

              <div className="text-center mt-3">
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </span>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgetPassword;
