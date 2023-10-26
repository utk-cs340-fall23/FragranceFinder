import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import "./App.css";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {

	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
			</Routes>
		</Router>
	);
}

export default App;
