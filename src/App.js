import React, { useEffect } from 'react';
import { publicRoutes, privateRoutes } from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WOW from 'wow.js';
import 'animate.css';

function App() {
  useEffect(() => {
    new WOW().init();
  }, []);
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <div className="wow animate__animated animate__fadeIn">
                    <Page />
                  </div>
                  
                }
              />
            )
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
