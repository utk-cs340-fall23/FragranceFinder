import React, { useEffect, useState } from 'react';
import auth from '../utils/auth';
import { sendGet } from '../utils/requests';

const Home = () => {
    const [user, setUser] = useState(null);
    const getMyUser = async function() {
        const response = await sendGet('/api/users/me');
        if (response.ok) {
            setUser(response.data);
        }
    }
    useEffect(function() {
        getMyUser();
    }, []);

    return (
        <div>
            <h1>FragranceFinder home page</h1>
			<p>Login Status: {auth.loggedIn() ? 'Logged In!' : 'Not Logged in :('}</p>
			<p>Authentication-protected endpoints working: {user ? 'Yes': 'No'}</p>
			{!auth.loggedIn() && (
                <div>
                    <a href="/login">Login</a>
                    <br />
                    <a href="/signup">Sign Up</a>
                </div>
            )}
			{auth.loggedIn() && (
                <div>
                    <button onClick={() => auth.logout()}>Log Out</button>
                </div>
            )}
			<a href="/email">Stephen Souther's email demo</a>
            <br/>
            <a href="/nav">Kien Nguyen's Navigation Bar demo</a>
        </div>
    );
};

export default Home;