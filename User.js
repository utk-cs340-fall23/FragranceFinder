import { useState, useEffect } from "react";
import AuthForm from "../components/AuthForm";
import '../assets/css/darkmode.css';
import { Button } from 'react-bootstrap';

function User() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    if(theme === 'light'){
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  const [showToast, setShowToast] = useState(false);

  return (
    <AuthForm
      setShowToast={setShowToast}
      showToast={showToast}
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
	  
	  <Button variant="primary" className="w-100 mt-3" onClick={toggleTheme}>Dark Mode</Button>
      <Button variant="" type="switch2" href='/newPass' className="w-100 mt-3">
        Change Password
      </Button>
    </AuthForm>
  );
}

export default User;
