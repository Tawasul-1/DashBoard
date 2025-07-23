import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Card, Spinner, Alert } from "react-bootstrap";
import { FaUser, FaEnvelope, FaRegIdCard, FaCrown, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import { userService } from "../api/services/UserService";
import { useAuth } from "../context/AuthContext";
import { date } from "yup";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await userService.getAllUsers(token);
        console.log(response.data);
        setUsers(response.data.results);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err.message || "Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-wrapper d-flex flex-column flex-lg-row">
        <Sidebar />
        <div className="main-content flex-grow-1 p-3">
          <Container
            fluid
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
          >
            <Spinner animation="border" variant="primary" />
          </Container>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper d-flex flex-column flex-lg-row">
        <Sidebar />
        <div className="main-content flex-grow-1 p-3">
          <Container fluid>
            <Alert variant="danger">{error}</Alert>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper d-flex flex-column flex-lg-row">
      <Sidebar />

      <div className="main-content flex-grow-1 p-3">
        <Container fluid>
          <h2 className="text-center fw-bold text-primary mb-4">Platform Users</h2>
          <Card className="shadow border-0 p-3">
            <Table responsive bordered hover className="align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>
                    <FaUser className="me-1" /> Username
                  </th>
                  <th>
                    <FaEnvelope className="me-1" /> Email
                  </th>
                  <th>
                    <FaRegIdCard className="me-1" /> Cards
                  </th>
                  <th>
                    <FaCrown className="me-1" /> Account Type
                  </th>
                  <th>
                    <FaCalendarAlt className="me-1" /> Premium Expiry
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg="light" pill>
                        {user.cardsCount || 0}
                      </Badge>
                    </td>
                    <td>
                      {user.isPremium ? (
                        <Badge bg="warning" text="dark">
                          Premium
                        </Badge>
                      ) : (
                        <Badge bg="light" text="dark">
                          Free
                        </Badge>
                      )}
                    </td>
                    <td>{user.is_premium ? new Date(user.premium_expiry).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default User;
