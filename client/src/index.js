import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Home from './routes/Home.js';
import Apply from './routes/Apply.js';
import Login from './routes/Login.js';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
