import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';

export default function EditCharacter({ character, add }) {
    // create a modal to edit the character
    const [show, setShow] = useState(false);
    const [name, setName] = useState(character.name ?? "");
    const [description, setDescription] = useState(character.description ?? "");
    const [image, setImage] = useState(character.image ?? "");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (add) {
            let newCharacter = {
                username: character.username,
                name: name,
                description: description,
                image: image,
            };
            fetch('/api/create-character', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            }).then(() => {
                console.log('character updated');
                handleClose();
            })
        } else {
            let newCharacter = {
                username: character.username,
                name: name,
                description: description,
                image: image,
                id: character.id
            };
            fetch('/api/edit-character', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            }).then(() => {
                console.log('character updated');
                handleClose();
            })
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {add ? "Create Character" : "Edit Character"}
            </Button>

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
                            {add ? "Create Character" : "Edit Character"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}