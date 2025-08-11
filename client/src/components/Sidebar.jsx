import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [openTopics, setOpenTopics] = useState(false);

  const linkClasses = ({ isActive }) =>
    `w-full text-left px-4 py-2 rounded-md text-sm font-medium transition ${
      isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-100'
    }`;

  return (
    <aside className="w-60 bg-gray-100 min-h-screen p-4 sticky top-0 border-r">
      <nav className="flex flex-col gap-3"style={{ padding: '0.5rem' }} >

  <NavLink to="/" className={linkClasses} end style={{ padding: '0.5rem' }}>
    Home
  </NavLink>

  <NavLink to="/explore" className={linkClasses}style={{ padding: '0.5rem' }}>
    Explore
  </NavLink>

   <NavLink to="/myposts" className={linkClasses} style={{ padding: '0.5rem' }}>
  MyPosts
</NavLink>

</nav>

    </aside>
  );
};

export default Sidebar;
