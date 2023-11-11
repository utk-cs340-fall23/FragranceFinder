import {useState} from "react";
import auth from '../utils/auth';
import { sendPost } from "../utils/requests";
import { Form, Button, Container, Row, Col, Toast } from 'react-bootstrap';
import AuthForm from "../components/AuthForm";
import '../assets/css/auth.css';

function Forgot() {
  // Initialize empty form
  // Will need the rest of this when looking up if the email is attached to an account or not
  const [formState, setFormState] = useState({
    email: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle changing values in form
  const handleFormChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  }

  // Handle submission of form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const response = await sendPost('/api/users/login/', formState);
    if (response.ok) {
        const { token } = response.data;
        auth.login(token);
    }
    else if (response.data && response.data.message) {
        setErrorMessage(response.data.message);
        setShowToast(true);
    }
  }

  return (
    <AuthForm
    setShowToast={setShowToast}
    showToast={showToast}
    errorMessage={errorMessage}
    >
      <h1>New Password</h1>
      <Form onSubmit={handleFormSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email Conf</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter 6-digit pin"
          name="email"
          value={formState.email}
          onChange={handleFormChange}
        />
      </Form.Group>
	  <Form.Group controlId="formBasicEmail">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter new password"
          name="email"
          value={formState.email}
          onChange={handleFormChange}
        />
      </Form.Group>
	  <Form.Group controlId="formBasicEmail">
        <Form.Label>New Password Conformation</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter new Password"
          name="email"
          value={formState.email}
          onChange={handleFormChange}
        />
      </Form.Group>

        <Button variant="primary" href="/newPass" className="w-100 mt-3">
          Submit
        </Button>
      </Form>
    </AuthForm>
  );
}

export default Forgot;