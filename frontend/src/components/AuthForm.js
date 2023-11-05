import {useState} from "react";
import auth from '../utils/auth';
import { sendPost } from "../utils/requests";
import { Form, Button, Container, Row, Col, Toast } from 'react-bootstrap';
import Navigation from "./Navigation";
import '../assets/css/auth.css';

function AuthForm({ setShowToast, showToast, errorMessage, children}) {
  return (
    <Container fluid className="auth-container">
        <Navigation />
      <Row className="justify-content-center align-items-center">
        <Col md={6} lg={4}>
          <div className="auth-box">
            {children}
            <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            bg="warning"
            className="d-inline-block m-1 w-100"
            position="middle-center"
          >
             {/* <Toast.Header>
              <strong className="me-auto">Login Error</strong>
            </Toast.Header> */}
            <Toast.Body><strong>{errorMessage}</strong></Toast.Body>
          </Toast>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthForm;