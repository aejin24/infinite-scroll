import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Detail from './Detail';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='' element={<App />} />
        <Route path='/:id' element={<Detail />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);