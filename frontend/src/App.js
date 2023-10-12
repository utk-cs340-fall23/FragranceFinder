import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './pages/hero/hero';
import Home from './pages/fullFront';
import Best from './pages/bestsellers';
import Navbar from './pages/fullFront';
import React from 'react'
import "./App.css";

function App() {

	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route path='/best' element={<Best />} />
			</Routes>
			<Navbar/>
			<Hero/>
		</Router>
	);
}

export default App;
