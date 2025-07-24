import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import "../Style-pages/Sentence.css";

const initialSentences = [
  { text: "I want to eat an apple 🍎" },
  { text: "Can I go outside? 🏃‍♂️" },
  { text: "I need help ✋" },
  { text: "I'm feeling happy 😊" },
];

const Sentences = () => {
  const [sentences, setSentences] = useState(initialSentences);
  const [newSentence, setNewSentence] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const handleAddSentence = () => {
    if (newSentence.trim() === "") return;
    setSentences([...sentences, { text: newSentence }]);
    setNewSentence("");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditText(sentences[index].text);
  };

  const handleSaveEdit = (index) => {
    const updated = [...sentences];
    updated[index].text = editText;
    setSentences(updated);
    setEditIndex(null);
    setEditText("");
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this sentence?")) {
      const updated = sentences.filter((_, i) => i !== index);
      setSentences(updated);
    }
  };

  return (
    <div className="dashboard-wrapper d-flex flex-column flex-md-row">
      <Sidebar />
      <main className="p-3 flex-grow-1 main-content">
        <Container>
          <h2 className="text-center mb-4">PECS Sentences</h2>

          {/* Add New Sentence Card */}
          <Row className="justify-content-center mb-4">
            <Col xs={12} md={8} lg={6}>
              <Card className="p-3 shadow-sm custom-sentence-card border-0">
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Add New Sentence</Form.Label>
                    <Form.Control
                      type="text"
                      value={newSentence}
                      onChange={(e) => setNewSentence(e.target.value)}
                      placeholder="e.g. I want juice 🧃"
                    />
                  </Form.Group>
                  <Button variant="success" onClick={handleAddSentence}>
                    Add Sentence
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>

          {/* Sentences Cards */}
          <Row className="g-3 justify-content-center">
            {sentences.map((sentence, index) => (
              <Col key={index} xs={12} sm={10} md={6} lg={4}>
                <Card className="text-center h-100 shadow-sm border-0 custom-sentence-card">
                  <Card.Body>
                    {editIndex === index ? (
                      <>
                        <Form.Control
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="d-flex justify-content-center gap-2 mt-3">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleSaveEdit(index)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setEditIndex(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Card.Text className="mt-2 fw-semibold fs-5">{sentence.text}</Card.Text>
                        <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(index)}
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default Sentences;
