import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import "../Style-pages/Cards.css"; // Using the same CSS file for a consistent look
import Sidebar from "../Components/Sidebar";
import CardService from "../api/services/CardService";
import CategoryService from "../api/services/CategoryService"; // Needed for the dropdown in modals

const DefaultCards = () => {
  // --- All state has been restored ---
  const [defaultCards, setDefaultCards] = useState([]);
  const [categories, setCategories] = useState([]); // To populate the category dropdown
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

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authentication required. Please login again.");
    return token;
  };

  // --- Fetching logic now includes categories for the modals ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        const [cardsResponse, categoriesResponse] = await Promise.all([
          CardService.getDefaultCards(token), // Fetches the default cards
          CategoryService.getAllCategories(token) // Fetches categories for the dropdown
        ]);
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

  const playAudio = (audioUrl) => {
    if (playingAudio) playingAudio.pause();
    const audio = new Audio(audioUrl);
    audio.play();
    setPlayingAudio(audio);
  };

  // --- All handler functions for editing, deleting, and adding are restored ---
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
      
      // IMPORTANT: Assumes a function like 'updateDefaultCard'. Change if needed.
      const response = await CardService.updateDefaultCard(editingCardId, formData, token);
      setDefaultCards(defaultCards.map((card) => (card.id === editingCardId ? response.data : card)));
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
        // IMPORTANT: Assumes a function like 'deleteDefaultCard'. Change if needed.
        await CardService.deleteDefaultCard(cardId, token);
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
      if (newAudioEnFile) formData.append("audio_en", newAudioEnFile);
      if (newAudioArFile) formData.append("audio_ar", newAudioArFile);
      
      // IMPORTANT: Assumes a function like 'addDefaultCard'. Change if needed.
      const response = await CardService.addDefaultCard(formData, token);
      setDefaultCards([response.data, ...defaultCards]);
      setSuccessMessage("Card added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
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

  if (loading) return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
  );

  if (error) return (
      <div className="dashboard-wrapper d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1 main-content"><Alert variant="danger">{error}</Alert></div>
      </div>
  );

  return (
    <div className="dashboard-wrapper d-flex flex-column flex-md-row">
      <Sidebar />
      <main className="p-4 flex-grow-1 main-content">
        <Container fluid>
          {successMessage && <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>{successMessage}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

          {/* --- The "Add New Card" button is restored --- */}
          <div className="page-header text-center mb-4">
            <h2 className="header-title">Default PECS Cards</h2>
            <Button variant="primary" className="add-new-btn" onClick={() => setShowAddModal(true)}>
              <i className="fas fa-plus-circle me-2"></i> Add Default Card
            </Button>
          </div>

          <Row className="g-4">
            {defaultCards.length === 0 ? (
              <Col xs={12}><div className="text-center p-5 bg-light rounded-3"><h3 className="text-muted">No Default Cards Found</h3></div></Col>
            ) : (
              defaultCards.map((card) => (
                <Col key={card.id} xs={12} sm={6} md={4} lg={3}>
                  <div className="wow-card-container">
                    <Card className="wow-card">
                      <Card.Body>
                        <div className="img-container mb-3"><img src={card.image} alt={card.title_en} className="card-img-top" /></div>
                        <Card.Title className="card-title-en">{card.title_en}</Card.Title>
                        <Card.Title className="card-title-ar">{card.title_ar}</Card.Title>
                        <Card.Text className="card-category">{card.category?.name_en || "Uncategorized"}</Card.Text>
                        <div className="audio-buttons my-3">
                          {card.audio_en && <Button variant="outline-light board1" size="sm" onClick={() => playAudio(card.audio_en)}>EN Audio</Button>}
                          {card.audio_ar && <Button variant="outline-light board1" size="sm" onClick={() => playAudio(card.audio_ar)}>AR Audio</Button>}
                        </div>
                        {/* --- Edit and Delete buttons are restored --- */}
                        <div className="action-buttons">
                          <Button variant="primary" className="add-new-btn" size="sm" onClick={() => handleEdit(card)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(card.id)}>Delete</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </Container>

        {/* --- Edit Modal is restored --- */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg" className="wow-modal">
            <Modal.Header closeButton><Modal.Title className="w-100 text-center">Edit Card</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Title (English)</Form.Label><Form.Control type="text" value={editedTitleEn} onChange={(e) => setEditedTitleEn(e.target.value)}/></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Title (Arabic)</Form.Label><Form.Control type="text" value={editedTitleAr} onChange={(e) => setEditedTitleAr(e.target.value)}/></Form.Group></Col>
                    </Row>
                    <Form.Group className="mb-3"><Form.Label>Category</Form.Label><Form.Select value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)}><option value="">Select Category</option>{categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name_en}</option>))}</Form.Select></Form.Group>
                    <Row>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Update Image</Form.Label><Form.Control type="file" accept="image/*" onChange={(e) => setEditedImageFile(e.target.files[0])}/></Form.Group></Col>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Update English Audio</Form.Label><Form.Control type="file" accept="audio/*" onChange={(e) => setEditedAudioEnFile(e.target.files[0])}/></Form.Group></Col>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Update Arabic Audio</Form.Label><Form.Control type="file" accept="audio/*" onChange={(e) => setEditedAudioArFile(e.target.files[0])}/></Form.Group></Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="secondary text-white" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSaveEdit} disabled={!editedTitleEn || !editedTitleAr || !editedCategory}>Save Changes</Button>
            </Modal.Footer>
        </Modal>

        {/* --- Add Modal is restored --- */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg" className="wow-modal">
            <Modal.Header closeButton><Modal.Title className="w-100 text-center">Add New Default Card</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Title (English)</Form.Label><Form.Control type="text" value={newTitleEn} onChange={(e) => setNewTitleEn(e.target.value)} placeholder="e.g. Apple"/></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Title (Arabic)</Form.Label><Form.Control type="text" value={newTitleAr} onChange={(e) => setNewTitleAr(e.target.value)} placeholder="مثلا. تفاح"/></Form.Group></Col>
                    </Row>
                    <Form.Group className="mb-3"><Form.Label>Category</Form.Label><Form.Select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}><option value="">Select Category</option>{categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name_en}</option>))}</Form.Select></Form.Group>
                    <Row>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Card Image (Required)</Form.Label><Form.Control type="file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files[0])} required/></Form.Group></Col>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>English Audio (Optional)</Form.Label><Form.Control type="file" accept="audio/*" onChange={(e) => setNewAudioEnFile(e.target.files[0])}/></Form.Group></Col>
                        <Col md={4}><Form.Group className="mb-3"><Form.Label>Arabic Audio (Optional)</Form.Label><Form.Control type="file" accept="audio/*" onChange={(e) => setNewAudioArFile(e.target.files[0])}/></Form.Group></Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="secondary text-white" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button variant="success" onClick={handleAddNewCard} disabled={!newTitleEn || !newTitleAr || !newImageFile || !newCategory}>Add Card</Button>
            </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default DefaultCards;