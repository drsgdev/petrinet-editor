import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import "../styles/Profile.scss";

export default function Profile() {
  return (
    <Container fluid>
      <Row className="pl-3 pr-3">
        <Col className="user-info mr-3 pt-5 pb-3">
          <div className="mb-3 h1">Username</div>
          <div className="h4">User description</div>
        </Col>
        <Col className="saved-nets pt-5 pb-3">
          <div className="mb-3 h1">Saved nets</div>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Petri net 1</Card.Title>
              <Card.Text>Petri net description.</Card.Text>
              <Button variant="primary">Open</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
