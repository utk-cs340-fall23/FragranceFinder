import {useState} from "react";
import auth from '../utils/auth';
import { sendPost } from "../utils/requests";
import { Form, Button, Container, Row, Col, Toast } from 'react-bootstrap';
import AuthForm from "../components/AuthForm";
import '../assets/css/auth.css';

function Login() {
  // Initialize empty form
  const [formState, setFormState] = useState({
    email: '',
    password: '',
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
      <h1>Login</h1>
      <Form onSubmit={handleFormSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={formState.email}
          onChange={handleFormChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          value={formState.password}
          onChange={handleFormChange}
        />
      </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Submit
        </Button>
      </Form>
    </AuthForm>
  );
}

export default Login;