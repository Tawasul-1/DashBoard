import React from "react";
import { Container, Table, Badge, Card } from "react-bootstrap";
import { FaUser, FaEnvelope, FaRegIdCard, FaCrown, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";

const users = [
  {
    id: 1,
    username: "YoumnaK",
    email: "youmna@example.com",
    cardsCount: 12,
    isPremium: true,
    premiumStartDate: "2025-07-01",
  },
  {
    id: 2,
    username: "AhmedSamir",
    email: "ahmed@example.com",
    cardsCount: 8,
    isPremium: false,
    premiumStartDate: null,
  },
  {
    id: 3,
    username: "SaraAli",
    email: "sara@example.com",
    cardsCount: 5,
    isPremium: true,
    premiumStartDate: "2025-06-15",
  },
];

const Users = () => {
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
                  <th><FaUser className="me-1" /> Username</th>
                  <th><FaEnvelope className="me-1" /> Email</th>
                  <th><FaRegIdCard className="me-1" /> Cards</th>
                  <th><FaCrown className="me-1" /> Account Type</th>
                  <th><FaCalendarAlt className="me-1" /> Premium Start</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg="light" pill>{user.cardsCount}</Badge>
                    </td>
                    <td>
                      {user.isPremium ? (
                        <Badge bg="warning" text="dark">Premium</Badge>
                      ) : (
                        <Badge bg="light" text="dark">Free</Badge>
                      )}
                    </td>
                    <td>
                      {user.isPremium ? user.premiumStartDate : "—"}
                    </td>
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

export default Users;
