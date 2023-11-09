import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Browsing from '../components/Browsing';
import auth from '../utils/auth';

const Home = () => {

    // Validate token at first page opening
    const checkLoginStatus = async () => {
        const validToken = await auth.validateToken();
        if (!validToken) {
            auth.removeToken();
        }
    }

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <div style={{
            height: '100vh',
            overflow: 'hidden'
        }}>
            <Navigation style={{
                height: '5%',
                width: '100%',
            }} />
            <Browsing style={{
                height: '95%',
                width: '100%',
                padding: '12px'
            }}/>
        </div>
    );
};

export default Home;