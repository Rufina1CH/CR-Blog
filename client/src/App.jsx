import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import BlogList from "./pages/BlogList";
import BlogEdit from "./pages/BlogEdit";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyPosts from "./pages/MyPosts";  // import the component

import BlogDetail from "./pages/BlogDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />
        <Header username={username} />
        <div className="flex flex-1">
          <aside className="w-64 h-screen sticky top-16 border-r border-gray-200 bg-white">
            <Sidebar />
          </aside>
          <main className="flex-1 p-6 md:p-8 pt-24 w-full">
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/create" element={<Create />} />
              <Route
                path="/login"
                element={<LoginPage onLogin={setUsername} />}
              />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/post/:id" element={<BlogDetail />} />
              <Route path="/post/:id/edit" element={<BlogEdit />} />
               <Route path="/myposts" element={<MyPosts />} /> 
              <Route path="/explore" element={<Explore />} />
            </Routes>
          </main>
        </div>
      </div>
  );
};

export default App;
