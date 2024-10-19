import Header from './component/Common/Header';
import Main from './component/Common/Main';
import Footer from './component/Common/Footer';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './component/Search/Search';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/search' element={<Search />} />
        </Routes>
        <Footer />
      </div>

    </Router>
  );
}

export default App;
