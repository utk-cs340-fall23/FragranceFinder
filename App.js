import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DemoHome from './pages/demos';
import DemoEmail from './pages/demos/email';
import DemoCrudExample from './pages/demos/CrudExample';
import DemoNavbar from './pages/demos/navigation';
import Forgot from './pages/fpass'
import "./App.css";

function App() {

	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/fpass' element={<Forgot />} />
				<Route exact path='/demos/' element={<DemoHome />} />
				<Route path='/demos/email' element={<DemoEmail />} />
				<Route path='/demos/crud' element={<DemoCrudExample />} />
				<Route path='/demos/nav' element={<DemoNavbar />} />
			</Routes>
		</Router>
	);
}

export default App;
