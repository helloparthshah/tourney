"use client"

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Collapse } from "react-bootstrap";

export default function Characters({ username }) {
  const [characters, setCharacters] = useState([]);
  const [open, setOpen] = useState(false);

  function CharacterCard({ character }) {
    return (
      <Col md={4} className="mb-3">
        <Card className="w-100 playing-card">
          <Card.Title style={{ paddingLeft: "2rem", paddingTop: "0.7rem", color: "white", fontSize: "1.5rem" }}>
            {character.name}
          </Card.Title>
          <Card.Img
            style={{
              padding: "1rem",
              height: "300px",
              objectFit: "cover",
              objectPosition: "center"
            }}
            variant="top"
            src={character.image} />
          <Card.Body style={{ paddingBottom: "50px" }} className="d-flex flex-column justify-content-between">
            <Card.Text className="h-100 d-flex flex-column justify-content-center text-center">
              {character.description}
            </Card.Text>
            <Row className="mt-3">
              <Col className="text-center">
                <div><b>Speed</b>: {character.speed} </div>
                <div><b>Strength</b>: {character.strength}</div>
                <div><b>Charisma</b>: {character.charisma}</div>
              </Col>
              <Col className="text-center">
                <div><b>Intelligence</b>: {character.intelligence}</div>
                <div><b>Luck</b>: {character.luck}</div>
                <div><b>Willpower</b>: {character.willpower}</div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
  }

  const toggleCollapse = () => {
    setOpen(!open);
  };

  useEffect(() => {
    fetch(`/api/getcharacters?username=${username}`)
      .then(response => response.json())
      .then(data => setCharacters(data));
  }, [username]);

  return (
    <Container>
      <h1 className="mb-3"><b>Your Characters</b></h1>
      <Row>
        {characters.map((character, index) => (
          <CharacterCard character={character} key={character.name} />
        ))}
      </Row>
    </Container>
  );
}