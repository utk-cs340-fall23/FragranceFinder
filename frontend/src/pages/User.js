import { useState } from "react";
import AuthForm from "../components/AuthForm";
import '../assets/css/auth.css';
import { Button } from 'react-bootstrap';

function User() {
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AuthForm
      setShowToast={setShowToast}
      showToast={showToast}
      errorMessage={errorMessage}
      // Use className to conditionally apply dark mode styles
      className={isDarkMode ? "dark-mode" : ""}
    >
      <h1>User</h1>
      <h3>Tracking</h3>
      <Button variant="primary" type="order" className="w-100 mt-3">
        Fragrance #1
      </Button>
      <Button variant="primary" type="order" className="w-100 mt-3">
        Fragrance #2
      </Button>
      <Button variant="primary" type="order" className="w-100 mt-3">
        Fragrance #3
      </Button>

      {/* Add margin-bottom to create space between sections */}
      <div className="mb-4"></div>

      <h3>Settings: </h3>
      {/* Use isDarkMode to conditionally apply dark mode styles */}
      <Button
        variant={isDarkMode ? "dark" : "light"}
        type="switch1"
        className="w-50 mt-3"
        onClick={toggleTheme}
      >
        Light
      </Button>
      <Button
        variant={isDarkMode ? "light" : "dark"}
        type="switch2"
        className="w-50 mt-3"
        onClick={toggleTheme}
      >
        Dark
      </Button>
      <Button variant="" type="switch2" href='/newPass' className="w-100 mt-3">
        Change Password
      </Button>
    </AuthForm>
  );
}

export default User;
