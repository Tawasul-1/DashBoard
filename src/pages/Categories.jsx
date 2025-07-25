import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Modal, Spinner, Alert, Container } from "react-bootstrap";
import "../Style-pages/Cards.css";
import Sidebar from "../Components/Sidebar";
import CategoryService from "../api/services/CategoryService";

const Categories = () => {
  const [state, setState] = useState({
    categories: [],
    loading: true,
    error: null,
    successMessage: null,
    showAddModal: false,
    showEditModal: false,
    editingId: null,
    newNameEn: "",
    newNameAr: "",
    newImageFile: null,
    newImagePreview: null,
    editedImage: "",
    editedImageFile: null,
    editedImagePreview: null,
  });

  const updateState = (newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authentication required. Please login again.");
    return token;
  };

  useEffect(() => {
    const fetchCategoriesWithCounts = async () => {
      try {
        const token = getAuthToken();
        const response = await CategoryService.getAllCategoriesWithCardCount(token);
        updateState({
          categories: response.data,
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
    fetchCategoriesWithCounts();
  }, []);

  useEffect(() => {
    if (state.newImageFile) {
      const url = URL.createObjectURL(state.newImageFile);
      updateState({ newImagePreview: url });
      return () => URL.revokeObjectURL(url);
    }
  }, [state.newImageFile]);

  useEffect(() => {
    if (state.editedImageFile) {
      const url = URL.createObjectURL(state.editedImageFile);
      updateState({ editedImagePreview: url });
      return () => URL.revokeObjectURL(url);
    }
  }, [state.editedImageFile]);

  const handleAddCategory = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("name_en", state.newNameEn);
      formData.append("name_ar", state.newNameAr);
      formData.append("image", state.newImageFile);

      // Debug form data before sending
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await CategoryService.createCategory(formData, token);

      updateState({
        categories: [{ ...response.data, cards_count: 0 }, ...state.categories],
        successMessage: "Category added successfully!",
        newNameEn: "",
        newNameAr: "",
        newImageFile: null,
        newImagePreview: null,
        showAddModal: false,
      });

      setTimeout(() => updateState({ successMessage: null }), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         JSON.stringify(err.response?.data) || 
                         err.message;
      updateState({
        error: errorMessage
      });
      setTimeout(() => updateState({ error: null }), 3000);
    }
  };

  const handleEdit = (category) => {
    updateState({
      editingId: category.id,
      editedImage: category.image,
      editedImageFile: null,
      editedImagePreview: null,
      showEditModal: true,
    });
  };

  const handleSave = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      if (state.editedImageFile) {
        formData.append("image", state.editedImageFile);
      }

      const response = await CategoryService.updateCategory(state.editingId, formData, token);

      updateState({
        categories: state.categories.map((cat) =>
          cat.id === state.editingId ? { ...response.data, cards_count: cat.cards_count } : cat
        ),
        successMessage: "Category image updated successfully!",
        showEditModal: false,
      });

      setTimeout(() => updateState({ successMessage: null }), 3000);
    } catch (err) {
      updateState({
        error: err.message,
      });
      setTimeout(() => updateState({ error: null }), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category and all its cards?")) {
      try {
        const token = getAuthToken();
        await CategoryService.deleteCategory(id, token);
        updateState({
          categories: state.categories.filter((cat) => cat.id !== id),
          successMessage: "Category deleted successfully!",
        });
        setTimeout(() => updateState({ successMessage: null }), 3000);
      } catch (err) {
        updateState({
          error: err.message,
        });
        setTimeout(() => updateState({ error: null }), 3000);
      }
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
          {state.error && (
            <Alert
              variant="danger"
              onClose={() => updateState({ error: null })}
              dismissible
              className="rounded-lg"
            >
              {state.error}
            </Alert>
          )}

          <div className="page-header text-center mb-4 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="header-title mb-3">Manage Categories</h2>
            <Button
              variant="primary"
              className="add-new-btn rounded-pill px-4"
              onClick={() => updateState({ showAddModal: true })}
            >
              <i className="fas fa-plus-circle me-2"></i> Add New Category
            </Button>
          </div>

          <Row className="g-4">
            {state.categories.length === 0 ? (
              <Col xs={12}>
                <div className="text-center p-5 bg-white rounded-lg shadow-sm">
                  <h3 className="text-muted mb-3">No Categories Found</h3>
                  <p className="text-muted">Start by adding your first category.</p>
                </div>
              </Col>
            ) : (
              state.categories.map((category) => (
                <Col key={category.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100 border-0 shadow-sm rounded-lg overflow-hidden">
                    <Card.Body className="d-flex flex-column">
                      <div
                        className="img-container mb-3 bg-light rounded-lg overflow-hidden"
                        style={{ height: "150px" }}
                      >
                        <img
                          src={category.image}
                          alt={category.name_en}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <Card.Title className="card-title-en text-center mb-2">
                        {category.name_en}
                      </Card.Title>
                      <Card.Title className="card-title-ar text-center mb-3">
                        {category.name_ar}
                      </Card.Title>
                      <Card.Text className="card-count text-muted text-center mb-3">
                        Cards: <strong>{category.cards_count || 0}</strong>
                      </Card.Text>
                      <div className="action-buttons d-flex justify-content-center gap-2 mt-auto">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleEdit(category)}
                        >
                          Edit Image
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleDelete(category.id)}
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

        {/* Add Category Modal */}
        <Modal
          show={state.showAddModal}
          onHide={() => updateState({ showAddModal: false })}
          centered
          size="lg"
          className="wow-modal"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="w-100 text-center">Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name (English) *</Form.Label>
                    <Form.Control
                      type="text"
                      value={state.newNameEn}
                      onChange={(e) => updateState({ newNameEn: e.target.value })}
                      placeholder="e.g. Food"
                      className="rounded"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name (Arabic) *</Form.Label>
                    <Form.Control
                      type="text"
                      value={state.newNameAr}
                      onChange={(e) => updateState({ newNameAr: e.target.value })}
                      placeholder="مثال: طعام"
                      className="rounded"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Category Image *</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      updateState({ newImageFile: e.target.files[0] });
                    }
                  }}
                  className="rounded"
                  required
                />
                <Form.Text className="text-muted">
                  Upload a clear image representing this category
                </Form.Text>
              </Form.Group>
              {state.newImagePreview && (
                <div className="text-center mt-3 bg-light rounded-lg p-2">
                  <img
                    src={state.newImagePreview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
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
              onClick={handleAddCategory}
              disabled={!state.newNameEn || !state.newNameAr || !state.newImageFile}
              className="rounded-pill px-4"
            >
              Add Category
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Image Modal */}
        <Modal
          show={state.showEditModal}
          onHide={() => updateState({ showEditModal: false })}
          centered
          size="lg"
          className="wow-modal"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="w-100 text-center">Update Category Image</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="text-center mb-4">
              <h5>Current Image</h5>
              <div className="bg-light rounded-lg p-2 mb-3">
                <img
                  src={state.editedImage}
                  alt="Current category"
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px" }}
                />
              </div>
            </div>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select New Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      updateState({ editedImageFile: e.target.files[0] });
                    }
                  }}
                  className="rounded"
                />
              </Form.Group>
              {state.editedImagePreview && (
                <div className="text-center mt-3 bg-light rounded-lg p-2">
                  <h6>New Image Preview:</h6>
                  <img
                    src={state.editedImagePreview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
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
              onClick={handleSave}
              disabled={!state.editedImageFile}
              className="rounded-pill px-4"
            >
              Update Image
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default Categories;
