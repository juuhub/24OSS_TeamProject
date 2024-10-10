import Header from './component/Common/Header';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './component/Search';

function App() {
  return (
    <div className="App">
      <Header />
    </div>
  );
}

export default App;
