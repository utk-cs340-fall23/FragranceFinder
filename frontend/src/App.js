import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages';
import Email from './pages/email';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './pages/navigation';
import "./App.css";

function App() {

	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route path='/email' element={<Email />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/nav' element={<Navbar />} />
			</Routes>
		</Router>
	);
}

export default App;
