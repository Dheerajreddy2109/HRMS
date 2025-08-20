
import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { User, Mail, Calendar, Building, Briefcase } from 'lucide-react';

const EmployeeList: React.FC = () => {
  const { employees } = useData();
  const { user } = useAuth();

  const filteredEmployees = user?.role === 'admin' 
    ? employees 
    : employees.filter(emp => emp.managerId === user?.id || emp.id === user?.id);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-900/30 text-red-400';
      case 'manager': return 'bg-blue-900/30 text-blue-400';
      default: return 'bg-green-900/30 text-green-400';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Employee Directory</h1>
        <p className="text-gray-400">
          Manage and view employee information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-yellow-400 transition-colors">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <User size={28} className="text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{employee.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(employee.role)}`}>
                  {employee.role}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={16} className="text-yellow-400" />
                <span className="text-sm">{employee.email}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Briefcase size={16} className="text-yellow-400" />
                <span className="text-sm">{employee.position}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Building size={16} className="text-yellow-400" />
                <span className="text-sm">{employee.department}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Calendar size={16} className="text-yellow-400" />
                <span className="text-sm">
                  Joined {format(new Date(employee.joiningDate), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>

            {employee.managerId && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  Reports to: {employees.find(e => e.id === employee.managerId)?.name || 'Manager'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <User size={64} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No employees found</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;