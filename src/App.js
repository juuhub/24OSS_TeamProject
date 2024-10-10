import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './component/Search';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <h1>Hi</h1>
      <Routes>
        <Route exact path="/" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
