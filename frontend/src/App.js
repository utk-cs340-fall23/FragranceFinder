import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages';
import Email from './pages/email';
import CrudExample from './pages/CrudExample';
import Navbar from './pages/navigation';
import "./App.css";

function App() {

	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route path='/email' element={<Email />} />
				<Route path='/crud' element={<CrudExample />} />
				<Route path='/nav' element={<Navbar />} />
			</Routes>
		</Router>
	);
}

export default App;
