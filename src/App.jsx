
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Explore from './pages/Explore';
import Create from './pages/Create'; 
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';

const App = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <div className="flex flex-1">
      <aside className="w-64 h-screen sticky top-16 border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 md:p-8 pt-24 w-full">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<Create />} />
          <Route path="/post/:id" element={<BlogDetail />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </main>
    </div>
  </div>
);

export default App;
