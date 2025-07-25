import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import "../Style-pages/Cards.css";
import CardService from "../api/services/CardService";
import CategoryService from "../api/services/CategoryService";

const DefaultCards = () => {
  const [defaultCards, setDefaultCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editedTitleEn, setEditedTitleEn] = useState("");
  const [editedTitleAr, setEditedTitleAr] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [editedImageFile, setEditedImageFile] = useState(null);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authentication required. Please login again.");
    return token;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        const [cardsResponse, categoriesResponse] = await Promise.all([
          CardService.getUserCards(token), // Fetches the default cards
          CategoryService.getAllCategories(token), // Fetches categories for dropdown
        ]);
        console.log("Cards Response:", cardsResponse);
        setDefaultCards(cardsResponse.data.results || cardsResponse.data);
        setCategories(categoriesResponse.data.results || categoriesResponse.data);
      } catch (err) {
        setError(err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (card) => {
    setEditingCardId(card.id);
    setEditedTitleEn(card.title_en);
    setEditedTitleAr(card.title_ar);
    setEditedCategory(card.category.id);
    setEditedImageFile(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("title_en", editedTitleEn);
      formData.append("title_ar", editedTitleAr);
      formData.append("category", editedCategory);
      if (editedImageFile) formData.append("image", editedImageFile);

      const response = await CardService.updateCard(editingCardId, formData, token);
      setDefaultCards(
        defaultCards.map((card) => (card.id === editingCardId ? response.data : card))
      );
      setSuccessMessage("Card updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        const token = getAuthToken();
        await CardService.deleteCard(cardId, token);
        setDefaultCards(defaultCards.filter((card) => card.id !== cardId));
        setSuccessMessage("Card deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleAddNewCard = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("title_en", newTitleEn);
      formData.append("title_ar", newTitleAr);
      formData.append("category", newCategory);
      formData.append("image", newImageFile);

      const response = await CardService.addNewCard(formData, token);
      setDefaultCards([response.data, ...defaultCards]);
      setSuccessMessage("Card added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setNewTitleEn("");
      setNewTitleAr("");
      setNewCategory("");
      setNewImageFile(null);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading)
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );

  return (
    <div className="dashboard-wrapper d-flex flex-column flex-md-row">
      <Sidebar />
      <main className="p-4 flex-grow-1 main-content">
        <Container fluid>
          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <div className="page-header text-center mb-4 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="header-title">Default PECS Cards</h2>
            <Button variant="primary" className="add-new-btn" onClick={() => setShowAddModal(true)}>
              <i className="fas fa-plus-circle me-2"></i> Add Default Card
            </Button>
          </div>

          <Row className="g-4">
            {defaultCards.length === 0 ? (
              <Col xs={12}>
                <div className="text-center p-5 bg-white rounded-lg shadow-sm">
                  <h3 className="text-muted mb-3">No Cards Found</h3>
                  <p className="text-muted">Start by adding your first PECS card.</p>
                </div>
              </Col>
            ) : (
              defaultCards.map((card) => (
                <Col key={card.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100 border-0 shadow-sm overflow-hidden rounded-3">
                    <Card.Body className="d-flex flex-column">
                      <div className="img-container mb-3 bg-light" style={{ height: "150px" }}>
                        <img
                          src={card.image}
                          alt={card.title_en}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <Card.Title className="card-title-en text-center mb-2">
                        {card.title_en}
                      </Card.Title>
                      <Card.Title className="card-title-ar text-center mb-2">
                        {card.title_ar}
                      </Card.Title>
                      <Card.Text className="card-category text-muted text-center mb-3">
                        {card.category?.name_en || "Uncategorized"}
                      </Card.Text>
                      <div className="action-buttons d-flex justify-content-center gap-2 mt-auto">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleEdit(card)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleDelete(card.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>

        {/* Edit Modal */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
          size="lg"
          className="wow-modal"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="w-100 text-center">Update Card Image</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {/* Get the card object based on the editingCardId */}
            {editingCardId && (
              <>
                {defaultCards.map((card) => {
                  if (card.id === editingCardId) {
                    return (
                      <div key={card.id}>
                        {/* Display current image if exists */}
                        {card.image && (
                          <div
                            className="bg-light rounded-lg p-2 mb-3 text-center"
                            style={{ maxHeight: "200px" }}
                          >
                            <h5>Current Image</h5>
                            <img
                              src={card.image}
                              alt="Current card"
                              className="img-fluid rounded"
                              style={{ maxHeight: "180px" }}
                            />
                          </div>
                        )}

                        {/* File input to update image */}
                        <Form.Group>
                          <Form.Label>Update Image</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditedImageFile(e.target.files[0])}
                          />
                        </Form.Group>

                        {/* Show preview of new image */}
                        {editedImageFile && (
                          <div className="mt-3 text-center">
                            <h5>Image Preview</h5>
                            <img
                              src={URL.createObjectURL(editedImageFile)}
                              alt="Preview"
                              className="img-fluid mb-3"
                              style={{ maxWidth: "100%", height: "auto" }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null; // Return nothing for cards that don't match
                })}
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-center border-0">
            <Button
              variant="outline-secondary"
              onClick={() => setShowEditModal(false)}
              className="rounded-pill px-4"
            >
              Cancel
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleSaveEdit}
              className="rounded-pill px-4"
              disabled={!editedTitleEn || !editedTitleAr || !editedCategory}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Modal */}
        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          centered
          size="lg"
          className="wow-modal"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="w-100 text-center">Add New Card</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (English)</Form.Label>
                    <Form.Control
                      type="text"
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      placeholder="e.g. Apple"
                      required
                      className="rounded"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Title (Arabic)</Form.Label>
                    <Form.Control
                      type="text"
                      value={newTitleAr}
                      onChange={(e) => setNewTitleAr(e.target.value)}
                      placeholder="مثلا. تفاح"
                      required
                      className="rounded"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                  className="rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Row>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Card Image (Required)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewImageFile(e.target.files[0])}
                      required
                      className="rounded"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-center border-0">
            <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}
              className="rounded-pill px-4">
              Cancel
            </Button>
            <Button
              variant="outline-success"
              onClick={handleAddNewCard}
              disabled={!newTitleEn || !newTitleAr || !newImageFile || !newCategory}
              className="rounded-pill px-4"
            >
              Add Card
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default DefaultCards;
