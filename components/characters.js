import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export default function Characters({ username }) {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        fetch(`/api/getcharacters?username=${username}`)
            .then(response => response.json())
            .then(data => setCharacters(data));
    }, [username]);

    return (
        <Container>
            <h2>Characters</h2>
            <ul>
                {characters.map(character => (
                    <Container>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                            <Card.Title>Name: {character.name}</Card.Title>
                            <Card.Text>Description: {character.description}</Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                            <ListGroup.Item><b>Speed</b>: {character.speed}</ListGroup.Item>
                            <ListGroup.Item><b>Strength</b>: {character.strength}</ListGroup.Item>
                            <ListGroup.Item><b>Charisma</b>: {character.charisma} </ListGroup.Item>
                            <ListGroup.Item><b>Intelligence</b>: {character.intelligence} </ListGroup.Item>
                            <ListGroup.Item><b>Luck</b>: {character.luck}</ListGroup.Item>
                            <ListGroup.Item><b>Willpower</b>: {character.willpower} </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Container>
                    // <li key={character.name}>
                    //     <h3>name: {character.name}</h3>
                    //     <p>description: {character.description}</p>
                    //     <p>Speed: {character.speed}</p>
                    //     <p>Strength: {character.strength}</p>
                    //     <p>Charisma: {character.charisma}</p>
                    //     <p>Intelligence: {character.intelligence}</p>
                    //     <p>Luck: {character.luck}</p>
                    //     <p>Willpower: {character.willpower}</p>
                    // </li>
                ))}
            </ul>
        </Container>
    );
}