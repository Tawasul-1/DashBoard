import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import "../Style-pages/Cards.css";
import Sidebar from "../Components/Sidebar";

const initialCards = [
  {
    image: "./Apple.png",
    label: "Apple",
    labelar: "تفاح",
    category: "Food",
  },
  {
    image: "./Books.png",
    label: "Book",
    labelar: "كتاب",
    category: "Vehicle",
  },
];

const Cards = () => {
  const [cards, setCards] = useState(initialCards);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editedImage, setEditedImage] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newLabelar, setNewLabelar] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newCategory, setNewCategory] = useState(""); // ✅ Dropdown category

  const handleEdit = (card, index) => {
    setSelectedCard(index);
    setEditedImage(card.image);
    setEditedImageFile(null);
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
      ...updatedCards[selectedCard],
      image: editedImageFile ? URL.createObjectURL(editedImageFile) : editedImage,
    };
    setCards(updatedCards);
    setShowEditModal(false);
    setEditedImageFile(null);
  };

  const handleAddNewCard = () => {
    if (newLabel && newLabelar && newImageFile && newCategory) {
      const newCard = {
        label: newLabel,
        labelar: newLabelar,
        image: URL.createObjectURL(newImageFile),
        category: newCategory,
      };
      setCards([...cards, newCard]);
      setNewLabel("");
      setNewLabelar("");
      setNewImageFile(null);
      setNewCategory("");
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
            <Button
              style={{ width: "200px" }}
              variant="primary text-white"
              onClick={() => setShowAddModal(true)}
            >
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
                    <Card.Text className="fw-semibold">{card.labelar}</Card.Text>
                    {card.category && (
                      <Card.Text className="text-muted small">Category: {card.category}</Card.Text>
                    )}
                    <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                      <Button id="prmary" size="sm" onClick={() => handleEdit(card, index)}>
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

              <Form.Group className="mb-3">
                <Form.Label>Label_Ar</Form.Label>
                <Form.Control
                  type="text"
                  value={newLabelar}
                  onChange={(e) => setNewLabelar(e.target.value)}
                  placeholder="مثلا. عصير"
                />
              </Form.Group>

              {/* ✅ Category Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Animal">Animal</option>
                  <option value="Color">Color</option>
                  <option value="Clothing">Clothing</option>
                </Form.Select>
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
              disabled={!newLabel || !newLabelar || !newImageFile || !newCategory}
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
