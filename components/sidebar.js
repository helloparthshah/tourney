"use client"

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Container
      className={`sidebar bg-dark text-light p-3 ${collapsed ? 'collapsed' : ''}`}
      style={{ width: collapsed ? '80px' : '250px', zIndex: 9999 }}
    >
      <Button variant="light" className="mb-3" onClick={toggleSidebar}>
        {collapsed ? 'Expand' : 'Collapse'}
      </Button>
      <Row className="d-flex flex-column align-items-center mb-4">
        <Col>
          <h1>Sidebar</h1>
        </Col>
      </Row>
      <Row className="d-flex flex-column align-items-center">
        <Col>
          <h1>Sidebar</h1>
        </Col>
      </Row>
      <Row className="d-flex flex-column align-items-center">
        <Col>
          <h1>Sidebar</h1>
        </Col>
      </Row>
    </Container>
  );
}
