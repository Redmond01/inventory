import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './routes/Admin/AdminDashboard';
import PartnerDashboard from './routes/Client/PartnerDashboard';
import ClientUniquePen from './routes/Client/uniquePen';
import AdminUniquePen from './routes/Admin/uniquePen';
import ClientAnalysis from './routes/Client/analysis';
import AdminAnalysis from './routes/Admin/analysis';
import Home from './routes/Home';
import Test from './test';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path='/admin' element={<AdminDashboard/>}/>
          <Route path='/partners' element={<PartnerDashboard/>}/>
          <Route path='/Clientlist/:id' element={<ClientUniquePen/>}/>
          <Route path='/Adminlist/:id' element={<AdminUniquePen/>}/>
          <Route path='/Clientanalysis/:id' element={<ClientAnalysis/>}/>
          <Route path='/Adminanalysis/:id' element={<AdminAnalysis/>}/>
          <Route path='test' element={<Test/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
