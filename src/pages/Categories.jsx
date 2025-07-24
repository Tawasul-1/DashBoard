import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Modal, Spinner, Alert } from "react-bootstrap";
import "../Style-pages/Cat.css";
import Sidebar from "../Components/Sidebar";
import CategoryService from "../api/services/CategoryService";

const Categories = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Add category modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newLabelAr, setNewLabelAr] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  // Edit category modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [editedLabelAr, setEditedLabelAr] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [editedImagePreview, setEditedImagePreview] = useState(null);

  // Get authentication token
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }
    return token;
  };

  // Fetch all categories with card counts
  useEffect(() => {
    const fetchCategoriesWithCounts = async () => {
      try {
        const token = getAuthToken();
        const response = await CategoryService.getAllCategoriesWithCardCount(token);
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        // Handle unauthorized error
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }
    };

    fetchCategoriesWithCounts();
  }, []);

  // Handle image preview for new category
  useEffect(() => {
    if (newImageFile) {
      const previewUrl = URL.createObjectURL(newImageFile);
      setNewImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [newImageFile]);

  // Handle image preview for edit category
  useEffect(() => {
    if (editedImageFile) {
      const previewUrl = URL.createObjectURL(editedImageFile);
      setEditedImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [editedImageFile]);

  // Add new category
  const handleAddCategory = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("label", newLabel);
      formData.append("label_ar", newLabelAr);
      formData.append("image", newImageFile);

      const response = await CategoryService.createCategory(formData, token);
      
      // Add the new category with initial card count of 0
      setCategories([{ ...response.data, cards_count: 0 }, ...categories]);
      
      setSuccessMessage("Category added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Reset form
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

  // Prepare edit modal with category data
  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditedLabel(category.label);
    setEditedLabelAr(category.label_ar);
    setEditedImage(category.image);
    setEditedImageFile(null);
    setEditedImagePreview(null);
    setShowEditModal(true);
  };

  // Update existing category
  const handleSave = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("label", editedLabel);
      formData.append("label_ar", editedLabelAr);
      if (editedImageFile) {
        formData.append("image", editedImageFile);
      }

      const response = await CategoryService.updateCategory(editingId, formData, token);
      
      // Update the category while preserving the card count
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

  // Delete category
  const handleDelete = async (id) => {
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

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1 main-content">
        {/* Success message */}
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
            {successMessage}
          </Alert>
        )}

        {/* Error message */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Categories</h2>
          <Button
            style={{ width: "200px" }}
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Add Category
          </Button>
        </div>

        <Row className="g-4">
          {categories.length === 0 ? (
            <Col>
              <Card className="text-center p-5">
                <Card.Body>
                  <Card.Title>No categories found</Card.Title>
                  <Card.Text>
                    Get started by adding your first category
                  </Card.Text>
                  <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    Add Category
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            categories.map((category) => (
              <Col key={category.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="cat-card shadow-sm border-0 p-3 h-100">
                  <div className="text-center mb-3">
                    <img
                      src={category.image}
                      alt={category.label}
                      className="img-fluid rounded"
                      style={{ height: "80px", objectFit: "contain" }}
                    />
                  </div>
                  <h5 className="text-center fw-semibold mb-1">{category.label}</h5>
                  <h5 className="text-center fw-semibold mb-1">{category.label_ar}</h5>
                  <p className="text-center text-muted mb-3">
                    Cards: <strong>{category.cards_count || 0}</strong>
                  </p>
                  <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Add Category Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Label (English)</Form.Label>
                <Form.Control
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Food"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Label (Arabic)</Form.Label>
                <Form.Control
                  type="text"
                  value={newLabelAr}
                  onChange={(e) => setNewLabelAr(e.target.value)}
                  placeholder="مثال: طعام"
                />
              </Form.Group>
              <Form.Group>
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
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
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

        {/* Edit Category Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Label (English)</Form.Label>
                <Form.Control
                  type="text"
                  value={editedLabel}
                  onChange={(e) => setEditedLabel(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Label (Arabic)</Form.Label>
                <Form.Control
                  type="text"
                  value={editedLabelAr}
                  onChange={(e) => setEditedLabelAr(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
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
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
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
      </div>
    </div>
  );
};

export default Categories;
