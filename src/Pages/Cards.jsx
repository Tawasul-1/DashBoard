import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import "../Style-pages/Cards.css";
import Sidebar from "../Components/Sidebar";

const initialCards = [
  {
    image: "https://via.placeholder.com/100?text=Apple",
    label: "Apple",
  },
  {
    image: "https://via.placeholder.com/100?text=Car",
    label: "Car",
  },
];

const Cards = () => {
  const [cards, setCards] = useState(initialCards);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null); // New

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const handleEdit = (card, index) => {
    setSelectedCard(index);
    setEditedLabel(card.label);
    setEditedImage(card.image);
    setEditedImageFile(null); // Reset
    setShowEditModal(true);
  };

  const handleDelete = (index) => {
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    setCards(updatedCards);
  };

  const handleSaveEdit = () => {
    const updatedCards = [...cards];
    updatedCards[selectedCard] = {
      image: editedImageFile ? URL.createObjectURL(editedImageFile) : editedImage,
      label: editedLabel,
    };
    setCards(updatedCards);
    setShowEditModal(false);
    setEditedImageFile(null);
  };

  const handleAddNewCard = () => {
    if (newLabel && newImageFile) {
      const newCard = {
        label: newLabel,
        image: URL.createObjectURL(newImageFile),
      };
      setCards([...cards, newCard]);
      setNewLabel("");
      setNewImageFile(null);
      setShowAddModal(false);
    }
  };

  return (
    <div className="dashboard-wrapper d-flex flex-column flex-md-row">
      <Sidebar />
      <main className="p-3 flex-grow-1 main-content">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">PECS Cards</h2>
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              ➕ Add New Card
            </Button>
          </div>

          <Row className="g-3 justify-content-center">
            {cards.map((card, index) => (
              <Col key={index} xs={10} sm={6} md={4} lg={3}>
                <Card className="text-center h-100 shadow-sm border-0 custom-pecs-card">
                  <Card.Body>
                    <div className="mb-2">
                      <img
                        src={card.image}
                        alt={card.label}
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    </div>
                    <Card.Text className="fw-semibold">{card.label}</Card.Text>
                    <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(card, index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Label</Form.Label>
                <Form.Control
                  type="text"
                  value={editedLabel}
                  onChange={(e) => setEditedLabel(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Current Image</Form.Label>
                <div className="mb-2">
                  <img
                    src={editedImageFile ? URL.createObjectURL(editedImageFile) : editedImage}
                    alt="Current"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Upload New Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditedImageFile(e.target.files[0])}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Label</Form.Label>
                <Form.Control
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Juice"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleAddNewCard}
              disabled={!newLabel || !newImageFile}
            >
              Add Card
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default Cards;
