import React, { useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import "../Style-pages/Cat.css";
import Sidebar from "../Components/Sidebar";

const initialCats = [
  {
    id: 1,
    label: "Food",
    image: "https://img.icons8.com/color/96/food.png",
    cardsCount: 12,
  },
  {
    id: 2,
    label: "Animals",
    image: "https://img.icons8.com/color/96/cat.png",
    cardsCount: 7,
  },
  {
    id: 3,
    label: "Drinks",
    image: "https://img.icons8.com/color/96/water-bottle.png",
    cardsCount: 5,
  },
  {
    id: 4,
    label: "Toys",
    image: "https://img.icons8.com/color/96/teddy-bear.png",
    cardsCount: 9,
  },
  {
    id: 5,
    label: "Clothes",
    image: "https://img.icons8.com/color/96/t-shirt.png",
    cardsCount: 6,
  },
];

const Cat = () => {
  const [cats, setCats] = useState(initialCats);
  const [editingId, setEditingId] = useState(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setEditedLabel(cat.label);
    setEditedImage(cat.image);
    setEditedImageFile(null);
  };

  const handleSave = (id) => {
    const updated = cats.map((cat) =>
      cat.id === id
        ? {
            ...cat,
            label: editedLabel,
            image: editedImageFile
              ? URL.createObjectURL(editedImageFile)
              : editedImage,
          }
        : cat
    );
    setCats(updated);
    setEditingId(null);
    setEditedImageFile(null);
  };

  const handleDelete = (id) => {
    const updated = cats.filter((cat) => cat.id !== id);
    setCats(updated);
  };

  const handleAddCategory = () => {
    const newCat = {
      id: Date.now(),
      label: newLabel,
      image: URL.createObjectURL(newImageFile),
      cardsCount: 0,
    };
    setCats([newCat, ...cats]);
    setNewLabel("");
    setNewImageFile(null);
    setIsAdding(false);
  };

  return (
    <div className="dashboard-wrapper d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1 main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Categories</h2>
          <Button variant="primary" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? "Cancel" : "➕ Add Category"}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-3 mb-4 shadow-sm">
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Label</Form.Label>
                  <Form.Control
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Category name"
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files[0])}
                  />
                </Form.Group>
                {newImageFile && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(newImageFile)}
                      alt="preview"
                      className="img-fluid rounded"
                      style={{ height: "80px", objectFit: "contain" }}
                    />
                  </div>
                )}
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button
                  variant="success"
                  onClick={handleAddCategory}
                  disabled={!newLabel || !newImageFile}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Card>
        )}

        <Row className="g-4">
          {cats.map((cat) => (
            <Col xs={12} md={6} lg={4} key={cat.id}>
              <Card className="cat-card shadow-sm border-0 p-3 h-100">
                {editingId === cat.id ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Label</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedLabel}
                        onChange={(e) => setEditedLabel(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Upload New Image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditedImageFile(e.target.files[0])}
                      />
                    </Form.Group>

                    {(editedImageFile || editedImage) && (
                      <div className="text-center mb-3">
                        <img
                          src={
                            editedImageFile
                              ? URL.createObjectURL(editedImageFile)
                              : editedImage
                          }
                          alt="preview"
                          className="img-fluid rounded"
                          style={{ height: "80px", objectFit: "contain" }}
                        />
                      </div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="success" onClick={() => handleSave(cat.id)}>
                        Save
                      </Button>
                      <Button variant="secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-3">
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="img-fluid rounded"
                        style={{ height: "80px", objectFit: "contain" }}
                      />
                    </div>
                    <h5 className="text-center fw-semibold mb-1">{cat.label}</h5>
                    <p className="text-center text-muted mb-3">
                      Cards: <strong>{cat.cardsCount}</strong>
                    </p>
                    <div className="d-flex justify-content-between mt-auto">
                      <Button size="sm" onClick={() => handleEdit(cat)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Cat;
