import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Users,
  Calendar,
  Clock,
  FileText,
  CheckSquare,
  Settings,
  UserPlus
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard', roles: ['admin', 'manager', 'employee'] },
    { to: '/employees', icon: Users, label: 'Employees', roles: ['admin', 'manager'] },
    { to: '/add-employee', icon: UserPlus, label: 'Add Employee', roles: ['admin'] },
    { to: '/attendance', icon: Clock, label: 'Attendance', roles: ['admin', 'manager', 'employee'] },
    { to: '/leaves', icon: FileText, label: 'Leave Requests', roles: ['admin', 'manager', 'employee'] },
    { to: '/leave-approvals', icon: CheckSquare, label: 'Leave Approvals', roles: ['admin', 'manager'] },
    { to: '/holidays', icon: Calendar, label: 'Holidays', roles: ['admin', 'manager', 'employee'] },
    { to: '/settings', icon: Settings, label: 'Settings', roles: ['admin', 'manager', 'employee'] },
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'employee')
  );

  return (
    <aside className="bg-gray-900 w-64 min-h-screen px-4 py-6">
      <nav className="space-y-2">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-yellow-400 text-black font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;