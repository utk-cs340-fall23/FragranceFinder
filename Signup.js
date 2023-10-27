import {useState} from "react";
import auth from '../utils/auth';
import { sendPost } from "../utils/requests";

function Signup() {
  // Initialize empty form
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    username: '',
	firstName: '',
	lastName: '',
  });

  const [error, setError] = useState(null);

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

    const response = await sendPost('/api/users/', formState);
    if (response.ok) {
        const { token } = response.data;
        auth.login(token);
    }
    else {
        if (response.data.message) {
            setError(response.data.message);
        }
    }
  }


  return (
	<div className="Auth-form-container">
		<form className="Auth-form" onSubmit={handleFormSubmit}>
			<div className="Auth-form-content">
				<h3 className="Auth-form-title">Sign Up</h3>
				<div className="text-center">
					Already registered?{" "} <a href="login">Sign In</a>
				</div>
				<div className="form-group mt-3">
					<label>First Name:  </label>
					<input name="firstName" value={formState.firstName} required onChange={handleFormChange}></input>
				</div>
				<div className="form-group mt-3">
					<label>Last Name: </label>
					<input name="lastName" value={formState.lastName} required onChange={handleFormChange}></input>
				</div>
				<div className="form-group mt-3">
					<label>Email: </label>
					<input name="email" value={formState.email} required onChange={handleFormChange}></input>
				</div>
				<div className="form-group mt-3">
					<label>Username: </label>
					<input name="username" value={formState.username} required onChange={handleFormChange}></input>
				</div>
				<div className="form-group mt-3">
					<label>Password: </label>
					<input name="password" value={formState.password} required onChange={handleFormChange}></input>
				</div>
				<div className="d-grid gap-2 mt-3">
					<div class="text-center">
						<button type="submit" className="btn btn-primary">Submit</button>
					</div>
					<p className="text-center mt-2"> 
					<a href="/">HOME</a>
					</p>
				</div>
			</div>
		</form>
	</div>
	)
}

export default Signup;