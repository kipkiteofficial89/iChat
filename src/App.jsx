import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Conversation from './pages/Conversation';
import Join from './pages/Join';

function App() {
  return (
    <BrowserRouter future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }}>
      <Routes>
        <Route path='/' Component={Home}>
          <Route path='conversation/:userid' Component={Conversation} />
        </Route>
        <Route path='/join' Component={Join} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
