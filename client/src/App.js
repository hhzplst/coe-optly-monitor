import React from 'react';
import logo from './logo.svg';
import './App.css';
import HistoryChart from './charts/HistoryChart';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div>
          <HistoryChart />
        </div>
      </div>
    );
  }
}

export default App;
