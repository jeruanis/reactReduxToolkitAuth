import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from '../features/signups/signup'
import Login from '../features/login/Login.js'
import Home from '../components/home'
import NavComponent from '../components/navbar/NavBar';
import Logout from '../components/logout';
import ErrorBoundary from './ErrorBoundary';


export default function App() {

   return (
      <ErrorBoundary>
      <div className="App">
         <main>
            <NavComponent />
            <Routes>
               {/* create routing */}
               <Route path="/signup" element={<Signup />} />
               <Route path="/login" element={<Login />} />
               <Route path="/home" element={<Home />} />
               <Route exact path="/" element={<Home />} />
               <Route path="/logout" element={<Logout />} />
            </Routes>
         </main>
      </div>
      </ErrorBoundary>
   )
}

// BrowserRouter is located in store.js



