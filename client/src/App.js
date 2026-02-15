import "./App.css";
import About from "./components/About";
import Alert from "./components/Alert";
// import Alert from "./components/Alert";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import NoteState from "./context/notes/NoteState";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React,{useState} from "react";

function App() {
  const [alert, setAlert] = useState(null)
  const showAlert =(message, type)=> {
    setAlert({
      message:message,
      type:type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500)
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert = {alert}/>
          <div className="container">
            <Routes>
              <Route path="/" exact element={<Home showAlert = {showAlert}/>} />
              <Route path="/about" exact element={<About />} />
              <Route path="/login" exact element={<Login showAlert = {showAlert}/>} />
              <Route path="/signup" exact element={<SignUp showAlert = {showAlert}/>} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
