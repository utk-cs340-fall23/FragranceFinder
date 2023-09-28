import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DemoHome from './pages/demos';
import DemoEmail from './pages/demos/email';
import DemoCrudExample from './pages/demos/CrudExample';
import DemoNavbar from './pages/demos/navigation';
import "./App.css";

import Home from "./pages";

function App() {

	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route exact path='/demos/' element={<DemoHome />} />
				<Route path='/demos/email' element={<DemoEmail />} />
				<Route path='/demos/crud' element={<DemoCrudExample />} />
				<Route path='/demos/nav' element={<DemoNavbar />} />
			</Routes>
		</Router>
	);
}

export default App;
