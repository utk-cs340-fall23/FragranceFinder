import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(function() {
    fetch('/api').then(response => {
      if (response.ok) {
        response.json().then(newData => {
          setData(newData);
        })
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {data ? data.message : 'Loading...'}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
