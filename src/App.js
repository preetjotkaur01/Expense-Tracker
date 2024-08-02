
import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Home from './components/Home';
import {BrowserRouter , Routes ,Route } from 'react-router-dom'

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
      <Route exact path="/login" element = {<Login/>}></Route>
      <Route exact path="/signup" element = {<Signup/>}></Route>
      <Route exact path="/" element = {<Home/>}></Route>
    
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
