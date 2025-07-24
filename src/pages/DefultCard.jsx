import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import "../Style-pages/Cards.css"; // Using the same CSS file for a consistent look
import Sidebar from "../Components/Sidebar";
import CardService from "../api/services/CardService";

const DefaultCards = () => {
  // State for default cards, loading, and errors
  const [defaultCards, setDefaultCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for audio playback
  const [playingAudio, setPlayingAudio] = useState(null);

  // Get token (still needed for authenticated API calls)
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }
    return token;
  };

  // Fetch only the default cards from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        // IMPORTANT: Assumes you have a function like 'getDefaultCards' in your service.
        // You may need to change this line to match your actual API service function.
        const cardsResponse = await CardService.getDefaultCards(token);
        setDefaultCards(cardsResponse.data.results || cardsResponse.data);
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

  // Audio playback function (remains the same)
  const playAudio = (audioUrl) => {
    if (playingAudio) {
      playingAudio.pause();
    }
    const audio = new Audio(audioUrl);
    audio.play();
    setPlayingAudio(audio);
  };

  // Loading spinner
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

  // Error message display
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
      <main className="p-4 flex-grow-1 main-content">
        <Container fluid>
          {/* Header - "Add New Card" button has been removed */}
          <div className="page-header text-center mb-4">
            <h2 className="header-title">Default PECS Cards</h2>
          </div>

          <Row className="g-4">
            {defaultCards.length === 0 ? (
              <Col xs={12}>
                <div className="text-center p-5 bg-light rounded-3">
                  <h3 className="text-muted">No Default Cards Found</h3>
                  <p>There are no system-default cards available at the moment.</p>
                </div>
              </Col>
            ) : (
              defaultCards.map((card) => (
                <Col key={card.id} xs={12} sm={6} md={4} lg={3}>
                  <div className="wow-card-container">
                    <Card className="wow-card">
                      <Card.Body>
                        <div className="img-container mb-3">
                          <img src={card.image} alt={card.title_en} className="card-img-top" />
                        </div>
                        <Card.Title className="card-title-en">{card.title_en}</Card.Title>
                        <Card.Title className="card-title-ar">{card.title_ar}</Card.Title>
                        <Card.Text className="card-category">
                          {card.category?.name_en || "Uncategorized"}
                        </Card.Text>

                        {/* Audio buttons are kept for playback */}
                        <div className="audio-buttons my-3">
                          {card.audio_en && (
                            <Button
                              variant="outline-light board1"
                              size="sm"
                              onClick={() => playAudio(card.audio_en)}
                            >
                              EN Audio
                            </Button>
                          )}
                          {card.audio_ar && (
                            <Button
                              variant="outline-light board1"
                              size="sm"
                              onClick={() => playAudio(card.audio_ar)}
                            >
                              AR Audio
                            </Button>
                          )}
                        </div>
                        
                        {/* Edit and Delete buttons have been removed */}
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default DefaultCards;