import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Flow from "./pages/Flow";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/flow" exact component={Flow} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;