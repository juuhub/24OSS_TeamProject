import Header from './component/Common/Header';
import Main from './component/Common/Main';
import Footer from './component/Common/Footer';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './component/Search';

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
