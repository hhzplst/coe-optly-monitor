import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProjectChart from './charts/ProjectChart';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div>
          <ProjectChart />
        </div>
      </div>
    );
  }
}

export default App;
