import React, { useState } from "react";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "../Style-pages/Login.css"; // Make sure this path is correct
import { authService } from "../api/services/AuthenticationService";
import { useAuth } from "../context/AuthContext";
// --- Import the necessary icons ---
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // --- State to toggle password visibility ---
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      const data = response.data;
      login(data.user, data.access, data.refresh);
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 100);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      {/* Left Side - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <h1 className="brand-name">Tawasul</h1>
          <p className="brand-tagline">Seamless Communication, Connected.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-form-wrapper">
        <div className="form-content w-100 text-center">
          <h2 className="form-title w-100 text-center">Sign In</h2>
          <p className="form-subtitle w-100 text-center">Enter your details to access your account.</p>

          {error && <Alert variant="danger" className="py-2 small w-100">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} noValidate className="w-100">
            {/* --- Email Input with Icon --- */}
            <Form.Group className="mb-4 modern-input-group" controlId="formEmail">
              <FaEnvelope className="input-icon" />
              <Form.Control
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="modern-input px-5 p-2"
              />
            </Form.Group>

            {/* --- Password Input with Lock and Eye Icons --- */}
            <Form.Group className="mb-4 modern-input-group" controlId="formPassword">
              <FaLock className="input-icon" />
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="modern-input px-5 p-2"
              />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>
            
            <Button
              type="submit"
              className="modern-login-btn"
              disabled={loading}
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;