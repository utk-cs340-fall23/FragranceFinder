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


  return(
	<div className="Auth-form-container">
		<form className="Auth-form" onSubmit={handleFormSubmit}>
			<div className="Auth-form-content">
				<h3 className="Auth-form-title">Sign In</h3>
				<div className="text-center">
					Not registered yet?{" "} <a href="signup">Sign Up</a>
				</div>
				<div className="form-group mt-3">
					<label>Email address: </label>
					<input name="email" value={formState.email} required onChange={handleFormChange}></input>
				</div>
				<div className="form-group mt-3">
					<label>Password: </label>
					<input name="password" value={formState.password} required onChange={handleFormChange}></input>
				</div>
				<div className="d-grd gap-2 mt-3">
					<button type="submit" className="btn btn-primary">Submit</button>
				</div>
				<p className="text-center mt-2">
					Forgot <a href="fpass">password?</a>
				</p>
				<p className="text-center mt-2"> 
					<a href="/">HOME</a>
				</p>
			</div>
		</form>
	</div>
  );
}

export default Login;