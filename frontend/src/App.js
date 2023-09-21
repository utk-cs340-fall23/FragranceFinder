import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages';
import Email from './pages/email';
import DB from './pages/database';

function App() {
	
	return (
		<Router>
			<Routes>
				<Route exact path='/' exact element={<Home />} />
				<Route path='/email' element={<Email />} />
				<Route path='/database' element={<DB />} />
			</Routes>
		</Router>
	);
}

export default App;
