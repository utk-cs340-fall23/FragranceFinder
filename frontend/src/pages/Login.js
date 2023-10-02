import {useState} from "react";
import auth from '../utils/auth';
import { sendPost } from "../utils/requests";

function Login() {
  // Initialize empty form
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

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
        setError(response.data.message);
    }
  }


  return (
    <div className="App">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2>Login</h2>
        <form onSubmit={handleFormSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          width: '500px',
        }}>
            <input name="email" value={formState.email} placeholder="Email" required onChange={handleFormChange}></input>
            <input name="password" value={formState.password} placeholder="Password" required onChange={handleFormChange}></input>
            <button type="submit">Submit</button>
            {error && (
                <div style={{color: 'red'}}>
                    <p>{error}</p>
                </div>
            )}
        </form>
      </div>
    </div>
  );
}

export default Login;