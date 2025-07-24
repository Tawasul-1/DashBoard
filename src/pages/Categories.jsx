import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Modal, Spinner, Alert, Container } from "react-bootstrap";
import "../Style-pages/Cards.css"; // Make sure this path is correct
import Sidebar from "../Components/Sidebar";
import CategoryService from "../api/services/CategoryService";

const Categories = () => {
  // --- All your existing state and functions remain the same ---
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newLabelAr, setNewLabelAr] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [editedLabelAr, setEditedLabelAr] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [editedImagePreview, setEditedImagePreview] = useState(null);

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
        setCategories(response.data);
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
    fetchCategoriesWithCounts();
  }, []);

  useEffect(() => {
    if (newImageFile) {
      const url = URL.createObjectURL(newImageFile);
      setNewImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [newImageFile]);

  useEffect(() => {
    if (editedImageFile) {
      const url = URL.createObjectURL(editedImageFile);
      setEditedImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [editedImageFile]);

  const handleAddCategory = async () => {
    // ... logic is identical
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("label", newLabel);
      formData.append("label_ar", newLabelAr);
      formData.append("image", newImageFile);

      const response = await CategoryService.createCategory(formData, token);

      setCategories([{ ...response.data, cards_count: 0 }, ...categories]);

      setSuccessMessage("Category added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setNewLabel("");
      setNewLabelAr("");
      setNewImageFile(null);
      setNewImagePreview(null);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (category) => {
    // ... logic is identical
    setEditingId(category.id);
    setEditedLabel(category.label);
    setEditedLabelAr(category.label_ar);
    setEditedImage(category.image);
    setEditedImageFile(null);
    setEditedImagePreview(null);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    // ... logic is identical
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("label", editedLabel);
      formData.append("label_ar", editedLabelAr);
      if (editedImageFile) {
        formData.append("image", editedImageFile);
      }

      const response = await CategoryService.updateCategory(editingId, formData, token);

      const updated = categories.map((cat) =>
        cat.id === editingId ? { ...response.data, cards_count: cat.cards_count } : cat
      );
      setCategories(updated);

      setSuccessMessage("Category updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    // ... logic is identical
    if (window.confirm("Are you sure you want to delete this category and all its cards?")) {
      try {
        const token = getAuthToken();
        await CategoryService.deleteCategory(id, token);
        setCategories(categories.filter((cat) => cat.id !== id));

        setSuccessMessage("Category deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="light" />
        </div>
      </div>
    );
  }

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

          {/* --- UPDATED HEADER --- */}
          <div className="page-header text-center mb-4">
            <h2 className="header-title">Manage Categories</h2>
            <Button variant="primary" className="add-new-btn" onClick={() => setShowAddModal(true)}>
              <i className="fas fa-plus-circle me-2"></i> Add New Category
            </Button>
          </div>

          <Row className="g-4">
            {categories.length === 0 ? (
              <Col xs={12}>
                <div className="text-center p-5 bg-light rounded-3">
                  <h3 className="text-muted">No Categories Found</h3>
                  <p>Start by adding a new category.</p>
                </div>
              </Col>
            ) : (
              categories.map((category) => (
                <Col key={category.id} xs={12} sm={6} md={4} lg={3}>
                  {/* --- UPDATED CARD --- */}
                  <div className="wow-card-container">
                    <Card className="wow-card">
                      <Card.Body>
                        <div className="img-container mb-3">
                          <img src={category.image} alt={category.label} className="card-img" />
                        </div>
                        <Card.Title className="card-title-en">{category.label}</Card.Title>
                        <Card.Title className="card-title-ar">{category.label_ar}</Card.Title>
                        <Card.Text className="card-count">
                          Cards: <strong>{category.cards_count || 0}</strong>
                        </Card.Text>
                        <div className="action-buttons mt-3">
                          <Button variant="primary" size="sm" onClick={() => handleEdit(category)}>
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </Container>

        {/* --- UPDATED MODALS --- */}
        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          centered
          size="lg"
          className="wow-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Label (English)</Form.Label>
                    <Form.Control
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="e.g. Food"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Label (Arabic)</Form.Label>
                    <Form.Control
                      type="text"
                      value={newLabelAr}
                      onChange={(e) => setNewLabelAr(e.target.value)}
                      placeholder="مثال: طعام"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Category Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                />
              </Form.Group>
              {newImagePreview && (
                <div className="text-center mt-3">
                  <img
                    src={newImagePreview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ height: "100px", objectFit: "contain" }}
                  />
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="secondary text-white" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddCategory}
              disabled={!newLabel || !newLabelAr || !newImageFile}
            >
              Add Category
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
          size="lg"
          className="wow-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Label (English)</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedLabel}
                      onChange={(e) => setEditedLabel(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Label (Arabic)</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedLabelAr}
                      onChange={(e) => setEditedLabelAr(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Update Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditedImageFile(e.target.files[0])}
                />
              </Form.Group>
              <div className="text-center mt-3">
                <img
                  src={editedImagePreview || editedImage}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ height: "100px", objectFit: "contain" }}
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="secondary text-white" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!editedLabel || !editedLabelAr}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default Categories;
