import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import "../Style-pages/Cards.css";
import Sidebar from "../Components/Sidebar";
import CardService from "../api/services/CardService";
import CategoryService from "../api/services/CategoryService";

const Cards = () => {
  const [state, setState] = useState({
    cards: [],
    categories: [],
    loading: true,
    error: null,
    successMessage: null,
    showEditModal: false,
    showAddModal: false,
    editingCardId: null,
    editedImageFile: null,
    newTitleEn: "",
    newTitleAr: "",
    newCategory: "",
    newImageFile: null,
    isDefault: false,
  });

  const updateState = (newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }
    return token;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        const [cardsResponse, categoriesResponse] = await Promise.all([
          CardService.getUserCards(token),
          CategoryService.getAllCategories(token),
        ]);

        updateState({
          cards: cardsResponse.data.results || cardsResponse.data,
          categories: categoriesResponse.data.results || categoriesResponse.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        updateState({
          error: err.message,
          loading: false,
        });

        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }
    };

    fetchData();
  }, []);

  const handleEdit = (card) => {
    updateState({
      editingCardId: card.id,
      editedImageFile: null,
      showEditModal: true,
      isDefault: card.is_default || false,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();

      if (state.editedImageFile) {
        formData.append("image", state.editedImageFile);
      }
      formData.append("is_default", state.isDefault);

      const response = await CardService.updateCard(state.editingCardId, formData, token);

      updateState({
        cards: state.cards.map((card) => 
          card.id === state.editingCardId ? { ...card, ...response.data } : card
        ),
        successMessage: "Card updated successfully!",
        showEditModal: false,
        editedImageFile: null,
        isDefault: false,
      });

      setTimeout(() => updateState({ successMessage: null }), 3000);
    } catch (err) {
      updateState({
        error: err.response?.data?.message || err.message,
      });
      setTimeout(() => updateState({ error: null }), 3000);
    }
  };

  const handleDelete = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        const token = getAuthToken();
        await CardService.deleteCard(cardId, token);

        updateState({
          cards: state.cards.filter((card) => card.id !== cardId),
          successMessage: "Card deleted successfully!",
        });

        setTimeout(() => updateState({ successMessage: null }), 3000);
      } catch (err) {
        updateState({
          error: err.response?.data?.message || err.message,
        });
        setTimeout(() => updateState({ error: null }), 3000);
      }
    }
  };

  const handleAddNewCard = async () => {
    try {
      if (!state.newTitleEn || !state.newTitleAr || !state.newCategory || !state.newImageFile) {
        updateState({
          error: "Please fill all required fields",
        });
        setTimeout(() => updateState({ error: null }), 3000);
        return;
      }

      const token = getAuthToken();
      const formData = new FormData();

      formData.append("title_en", state.newTitleEn);
      formData.append("title_ar", state.newTitleAr);
      formData.append("category_id", state.newCategory);
      formData.append("image", state.newImageFile);
      formData.append("is_default", state.isDefault);

      const response = await CardService.addNewCard(formData, token);

      updateState({
        cards: [response.data, ...state.cards],
        successMessage: "Card added successfully!",
        showAddModal: false,
        newTitleEn: "",
        newTitleAr: "",
        newCategory: "",
        newImageFile: null,
        isDefault: false,
      });

      setTimeout(() => updateState({ successMessage: null }), 3000);
    } catch (err) {
      updateState({
        error: err.response?.data?.message || err.message,
      });
      setTimeout(() => updateState({ error: null }), 3000);
    }
  };

  if (state.loading) {
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content">
          <Alert variant="danger" onClose={() => updateState({ error: null })} dismissible>
            {state.error}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper d-flex flex-column flex-md-row">
      <Sidebar />
      <main className="p-4 flex-grow-1 main-content">
        <Container fluid>
          {state.successMessage && (
            <Alert
              variant="success"
              onClose={() => updateState({ successMessage: null })}
              dismissible
              className="rounded-lg"
            >
              {state.successMessage}
            </Alert>
          )}

          <div className="page-header text-center mb-4 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="header-title mb-3">PECS Cards</h2>
            <Button
              variant="primary"
              className="add-new-btn rounded-pill px-4"
              onClick={() => updateState({ showAddModal: true })}
            >
              <i className="fas fa-plus-circle me-2"></i> Add New Card
            </Button>
          </div>

          <Row className="g-4">
            {state.cards.length === 0 ? (
              <Col xs={12}>
                <div className="text-center p-5 bg-white rounded-lg shadow-sm">
                  <h3 className="text-muted mb-3">No Cards Found</h3>
                  <p className="text-muted">Start by adding your first PECS card.</p>
                </div>
              </Col>
            ) : (
              state.cards.map((card) => (
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
                      <Card.Title className="card-title-ar text-center mb-3">
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
          show={state.showEditModal}
          onHide={() => updateState({ showEditModal: false })}
          centered
          size="lg"
          className="wow-modal"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="w-100 text-center">Update Card</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="text-center mb-4">
              <h5>Current Image</h5>
              <div className="bg-light rounded-lg p-2 mb-3" style={{ maxHeight: "200px" }}>
                <img
                  src={state.cards.find((c) => c.id === state.editingCardId)?.image}
                  alt="Current card"
                  className="img-fluid rounded"
                  style={{ maxHeight: "180px" }}
                />
              </div>
            </div>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select New Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateState({ editedImageFile: e.target.files[0] })}
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Set as default"
                  checked={state.isDefault}
                  onChange={(e) => updateState({ isDefault: e.target.checked })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-center border-0">
            <Button
              variant="outline-secondary"
              onClick={() => updateState({ showEditModal: false })}
              className="rounded-pill px-4"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              className="rounded-pill px-4"
            >
              Update Card
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Modal */}
        <Modal
          show={state.showAddModal}
          onHide={() => updateState({ showAddModal: false })}
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
                    <Form.Label>Title (English) *</Form.Label>
                    <Form.Control
                      type="text"
                      value={state.newTitleEn}
                      onChange={(e) => updateState({ newTitleEn: e.target.value })}
                      placeholder="e.g. Apple"
                      required
                      className="rounded"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (Arabic) *</Form.Label>
                    <Form.Control
                      type="text"
                      value={state.newTitleAr}
                      onChange={(e) => updateState({ newTitleAr: e.target.value })}
                      placeholder="مثلا. تفاح"
                      required
                      className="rounded"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  value={state.newCategory}
                  onChange={(e) => updateState({ newCategory: e.target.value })}
                  required
                  className="rounded"
                >
                  <option value="">Select Category</option>
                  {state.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Card Image *</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateState({ newImageFile: e.target.files[0] })}
                  required
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Set as default"
                  checked={state.isDefault}
                  onChange={(e) => updateState({ isDefault: e.target.checked })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-center border-0">
            <Button
              variant="outline-secondary"
              onClick={() => updateState({ showAddModal: false })}
              className="rounded-pill px-4"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddNewCard}
              disabled={
                !state.newTitleEn || !state.newTitleAr || !state.newImageFile || !state.newCategory
              }
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

export default Cards;
