import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-black border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="font-bold text-black text-sm">HR</span>
            </div>
            <h1 className="text-xl font-bold text-white">HRMS Portal</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-yellow-400 transition-colors">
            <Bell size={20} />
          </button>
          
          <div className="flex items-center space-x-3 text-white">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <User size={20} className="text-black" />
            </div>
          </div>
          
          <button
            onClick={logout}
            className="text-gray-400 hover:text-yellow-400 transition-colors ml-4"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;