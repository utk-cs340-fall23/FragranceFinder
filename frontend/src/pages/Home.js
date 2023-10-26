import React from 'react';
import Navigation from '../components/Navigation';
import Browsing from '../components/Browsing';

const Home = () => {
    return (
        <>
            <Navigation style={{
                height: '8%',
                width: '100%',
            }} />
            <Browsing style={{
                height: '92%',
                width: '100%',
                padding: '12px'
            }}/>
        </>
    );
};

export default Home;