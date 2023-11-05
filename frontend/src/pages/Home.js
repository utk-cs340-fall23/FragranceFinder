import React from 'react';
import Navigation from '../components/Navigation';
import Browsing from '../components/Browsing';

const Home = () => {
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