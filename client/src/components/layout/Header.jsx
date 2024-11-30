import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black text-white z-50 px-8">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Roomify</h1>
          <span className="text-gray-400">|</span>
          <span className="text-sm">{user?.role} Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {user?.username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
