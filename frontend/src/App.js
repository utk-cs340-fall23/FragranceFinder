import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages';
import Email from './pages/email';
import CrudExample from './pages/CrudExample';

function App() {

	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<Home />} />
				<Route path='/email' element={<Email />} />
				<Route path='/crud' element={<CrudExample />} />
			</Routes>
		</Router>
	);
}

export default App;
