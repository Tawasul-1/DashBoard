import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import "../Style-pages/Cards.css";
import Sidebar from "../Components/Sidebar";
import CardService from "../api/services/CardService";
import CategoryService from "../api/services/CategoryService";

const Cards = () => {
  const [cards, setCards] = useState([]);
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
  const [editedAudioEnFile, setEditedAudioEnFile] = useState(null);
  const [editedAudioArFile, setEditedAudioArFile] = useState(null);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newAudioEnFile, setNewAudioEnFile] = useState(null);
  const [newAudioArFile, setNewAudioArFile] = useState(null);

  // Audio state
  const [playingAudio, setPlayingAudio] = useState(null);

  // Get authentication token
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }
    return token;
  };

  // Fetch cards and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        
        // Fetch cards
        const cardsResponse = await CardService.getUserCards(token);
        setCards(cardsResponse.data.results || cardsResponse.data);
        
        // Fetch categories
        const categoriesResponse = await CategoryService.getAllCategories(token);
        setCategories(categoriesResponse.data.results || categoriesResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }
    };

    fetchData();
  }, []);

  // Play audio
  const playAudio = (audioUrl) => {
    if (playingAudio) {
      playingAudio.pause();
    }
    const audio = new Audio(audioUrl);
    audio.play();
    setPlayingAudio(audio);
  };

  // Handle edit card
  const handleEdit = (card) => {
    setEditingCardId(card.id);
    setEditedTitleEn(card.title_en);
    setEditedTitleAr(card.title_ar);
    setEditedCategory(card.category.id);
    setEditedImageFile(null);
    setEditedAudioEnFile(null);
    setEditedAudioArFile(null);
    setShowEditModal(true);
  };

  // Save edited card
  const handleSaveEdit = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("title_en", editedTitleEn);
      formData.append("title_ar", editedTitleAr);
      formData.append("category", editedCategory);
      if (editedImageFile) formData.append("image", editedImageFile);
      if (editedAudioEnFile) formData.append("audio_en", editedAudioEnFile);
      if (editedAudioArFile) formData.append("audio_ar", editedAudioArFile);

      const response = await CardService.updateCard(editingCardId, formData, token);
      
      setCards(cards.map(card => 
        card.id === editingCardId ? response.data : card
      ));
      
      setSuccessMessage("Card updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Delete card
  const handleDelete = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        const token = getAuthToken();
        await CardService.deleteCard(cardId, token);
        
        setCards(cards.filter(card => card.id !== cardId));
        
        setSuccessMessage("Card deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Add new card
  const handleAddNewCard = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("title_en", newTitleEn);
      formData.append("title_ar", newTitleAr);
      formData.append("category", newCategory);
      formData.append("image", newImageFile);
      if (newAudioEnFile) formData.append("audio_en", newAudioEnFile);
      if (newAudioArFile) formData.append("audio_ar", newAudioArFile);

      const response = await CardService.addNewCard(formData, token);
      
      setCards([response.data, ...cards]);
      
      setSuccessMessage("Card added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Reset form
      setNewTitleEn("");
      setNewTitleAr("");
      setNewCategory("");
      setNewImageFile(null);
      setNewAudioEnFile(null);
      setNewAudioArFile(null);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

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
    <div className="dashboard-wrapper d-flex flex-column flex-md-row">
      <Sidebar />
      <main className="p-3 flex-grow-1 main-content">
        <Container>
          {/* Success/Error messages */}
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
            {cards.length === 0 ? (
              <Col>
                <Card className="text-center p-5">
                  <Card.Body>
                    <Card.Title>No cards found</Card.Title>
                    <Card.Text>
                      Get started by adding your first card
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              cards.map((card) => (
                <Col key={card.id} xs={10} sm={6} md={4} lg={3}>
                  <Card className="text-center h-100 shadow-sm border-0 custom-pecs-card">
                    <Card.Body>
                      <div className="mb-2">
                        <img
                          src={card.image}
                          alt={card.title_en}
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                      </div>
                      <Card.Text className="fw-semibold">{card.title_en}</Card.Text>
                      <Card.Text className="fw-semibold">{card.title_ar}</Card.Text>
                      <Card.Text className="text-muted small">
                        Category: {card.category?.name_en || 'Uncategorized'}
                      </Card.Text>
                      
                      <div className="d-flex justify-content-center gap-2 mb-2">
                        {card.audio_en && (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => playAudio(card.audio_en)}
                          >
                            EN Audio
                          </Button>
                        )}
                        {card.audio_ar && (
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => playAudio(card.audio_ar)}
                          >
                            AR Audio
                          </Button>
                        )}
                      </div>
                      
                      <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                        <Button variant="primary" size="sm" onClick={() => handleEdit(card)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
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
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (English)</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedTitleEn}
                      onChange={(e) => setEditedTitleEn(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (Arabic)</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedTitleAr}
                      onChange={(e) => setEditedTitleAr(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  value={editedCategory} 
                  onChange={(e) => setEditedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name_en}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Update Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditedImageFile(e.target.files[0])}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Update English Audio</Form.Label>
                    <Form.Control
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setEditedAudioEnFile(e.target.files[0])}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Update Arabic Audio</Form.Label>
                    <Form.Control
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setEditedAudioArFile(e.target.files[0])}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveEdit}
              disabled={!editedTitleEn || !editedTitleAr || !editedCategory}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add New Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (Arabic)</Form.Label>
                    <Form.Control
                      type="text"
                      value={newTitleAr}
                      onChange={(e) => setNewTitleAr(e.target.value)}
                      placeholder="مثلا. تفاح"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name_en}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Card Image (Required)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewImageFile(e.target.files[0])}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>English Audio (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setNewAudioEnFile(e.target.files[0])}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Arabic Audio (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setNewAudioArFile(e.target.files[0])}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleAddNewCard}
              disabled={!newTitleEn || !newTitleAr || !newImageFile || !newCategory}
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
