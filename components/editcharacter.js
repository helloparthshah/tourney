import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Col, Row, Spinner } from 'react-bootstrap';

export default function EditCharacter({ character, add, onCharacterUpdate }) {
    // create a modal to edit the character
    const [show, setShow] = useState(false);
    const [name, setName] = useState(character.name ?? "");
    const [description, setDescription] = useState(character.description ?? "");
    const [image, setImage] = useState(character.image ?? "");
    const [loading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = (e) => {
        e.preventDefault();
        setLoading(true);
        let newCharacter = {
            username: character.username,
            id: character.id
        };
        fetch('/api/delete-character', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter)
        }).then(() => {
            console.log('character deleted');
            setLoading(false);
            setShowDelete(false);
            onCharacterUpdate();
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (add) {
            let newCharacter = {
                username: character.username,
                name: name,
                description: description,
                image: image,
            };
            await fetch('/api/create-character', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            }).then(() => {
                console.log('character updated');
            })
        } else {
            let newCharacter = {
                username: character.username,
                name: name,
                description: description,
                image: image,
                id: character.id
            };
            await fetch('/api/edit-character', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            }).then(() => {
                console.log('character updated');
            })
        }
        setLoading(false);
        handleClose();
        onCharacterUpdate();
        setName("");
        setDescription("");
        setImage("");
    }

    const [showDelete, setShowDelete] = useState(false);

    return (
        <Row>
            <Col>
                <Button variant="primary" onClick={handleShow}>
                    {add ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                    </svg>}
                </Button>
            </Col>
            <Col>
                <Button variant="danger" onClick={() => setShowDelete(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                </Button>
            </Col>
            <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Character</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this character?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelete(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        {loading ? <Spinner animation="border" />
                            : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Character</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="textarea" as="textarea" required value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="text" required value={image} onChange={(e) => setImage(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {
                                loading ? <Spinner animation="border" /> : (
                                    add ? "Create Character" : "Edit Character")
                            }
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Row>
    )
}