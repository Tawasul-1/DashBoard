import React, { useState } from "react";
import { Card, Button, Form, Row, Col, Modal } from "react-bootstrap";
import "../Style-pages/Cat.css";
import Sidebar from "../Components/Sidebar";

const initialCats = [
  {
    id: 1,
    label: "Food",
    labelar: "طعام",
    image: "https://img.icons8.com/color/96/food.png",
    cardsCount: 12,
  },
  {
    id: 2,
    label: "Animals",
    labelar: "حيوانات",
    image: "https://img.icons8.com/color/96/cat.png",
    cardsCount: 7,
  },
  {
    id: 3,
    label: "Drinks",
    labelar: "مشروبات",
    image: "https://img.icons8.com/color/96/water-bottle.png",
    cardsCount: 5,
  },
  {
    id: 4,
    label: "Toys",
    labelar: "ألعاب",
    image: "https://img.icons8.com/color/96/teddy-bear.png",
    cardsCount: 9,
  },
  {
    id: 5,
    label: "Clothes",
    labelar: "ملابس",
    image: "https://img.icons8.com/color/96/t-shirt.png",
    cardsCount: 6,
  },
];

const Cat = () => {
  const [cats, setCats] = useState(initialCats);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newLabelar, setNewLabelar] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [editedLabelar, setEditedLabelar] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null);

  const handleAddCategory = () => {
    const newCat = {
      id: Date.now(),
      label: newLabel,
      labelar: newLabelar,
      image: URL.createObjectURL(newImageFile),
      cardsCount: 0,
    };
    setCats([newCat, ...cats]);
    setNewLabel("");
    setNewLabelar("");
    setNewImageFile(null);
    setShowAddModal(false);
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setEditedLabel(cat.label);
    setEditedLabelar(cat.labelar);
    setEditedImage(cat.image);
    setEditedImageFile(null);
    setShowEditModal(true);
  };

  const handleSave = () => {
    const updated = cats.map((cat) =>
      cat.id === editingId
        ? {
            ...cat,
            label: editedLabel,
            labelar: editedLabelar,
            image: editedImageFile ? URL.createObjectURL(editedImageFile) : editedImage,
          }
        : cat
    );
    setCats(updated);
    setShowEditModal(false);
    setEditedImageFile(null);
  };

  const handleDelete = (id) => {
    const updated = cats.filter((cat) => cat.id !== id);
    setCats(updated);
  };

  return (
    <div className="dashboard-wrapper d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1 main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Categories</h2>
          <Button
            style={{ width: "200px" }}
            variant="primary text-white"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Add Category
          </Button>
        </div>

        <Row className="g-4">
          {cats.map((cat) => (
            <Col key={cat.id} xs={10} sm={6} md={4} lg={3}>
              <Card className="cat-card shadow-sm border-0 p-3 h-100">
                <div className="text-center mb-3">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="img-fluid rounded"
                    style={{ height: "80px", objectFit: "contain" }}
                  />
                </div>
                <h5 className="text-center fw-semibold mb-1">{cat.label}</h5>
                <h5 className="text-center fw-semibold mb-1">{cat.labelar}</h5>
                <p className="text-center text-muted mb-3">
                  Cards: <strong>{cat.cardsCount}</strong>
                </p>
                <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                  <Button id="prmary" size="sm" onClick={() => handleEdit(cat)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cat.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Label</Form.Label>
                <Form.Control
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Snacks"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Label_Ar</Form.Label>
                <Form.Control
                  type="text"
                  value={newLabelar}
                  onChange={(e) => setNewLabelar(e.target.value)}
                  placeholder="مثلا. ثعبان"
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
              {newImageFile && (
                <div className="text-center mt-3">
                  <img
                    src={URL.createObjectURL(newImageFile)}
                    alt="preview"
                    className="img-fluid rounded"
                    style={{ height: "80px", objectFit: "contain" }}
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
              variant="success"
              onClick={handleAddCategory}
              disabled={!newLabel || !newLabelar || !newImageFile}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
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
                <Form.Label>Label</Form.Label>
                <Form.Control
                  type="text"
                  value={editedLabelar}
                  onChange={(e) => setEditedLabelar(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Upload New Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditedImageFile(e.target.files[0])}
                />
              </Form.Group>
              <div className="text-center mt-3">
                <img
                  src={editedImageFile ? URL.createObjectURL(editedImageFile) : editedImage}
                  alt="preview"
                  className="img-fluid rounded"
                  style={{ height: "80px", objectFit: "contain" }}
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Cat;
