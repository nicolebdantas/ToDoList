import React, {useState, useEffect} from 'react';
import './App.css';

import Home from './page/Home.js';
import Signup from './page/Signup';
import Login from './page/Login';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
    <div>
      <section>                              
          <Routes>                                                                        
             <Route path="/" element={<Home/>}/>
             <Route path="/signup" element={<Signup/>}/>
             <Route path="/login" element={<Login/>}/>
          </Routes>                    
      </section>
    </div>
  </Router>
  );
}

export default App;