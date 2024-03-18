import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/app/store'; 

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}> 
      <Router>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
