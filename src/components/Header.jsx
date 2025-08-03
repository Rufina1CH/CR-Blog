import React from 'react';
import { Link } from 'react-router-dom';
import profileImg from '../assets/image.png';

const Header = () => (
  <header className="w-full bg-white border-b shadow sticky top-0 z-50" style={{ padding: '0.5rem' }}>
    <div className="flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold text-purple-700">
          CR-Blog
        </Link>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <nav className="flex gap-3">
          <Link
            to="/"
            className="font-medium px-4 py-2 rounded-md text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition" style={{ padding: '0.5rem' }}
          >
            Home
          </Link>
          <Link
            to="/create"
            className="font-medium px-4 py-2 rounded-md text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition" style={{ padding: '0.5rem' }}
          >
            Create Post
          </Link>
        </nav>

        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <img
          src={profileImg}
          alt="profile"
          className="w-8 h-8 rounded-full border-2 border-purple-500"
        />
      </div>
    </div>
  </header>
);

export default Header;
