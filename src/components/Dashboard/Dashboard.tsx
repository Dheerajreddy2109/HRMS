import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import {
  Users,
  Clock,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, attendanceRecords, holidays, employees } = useData();

  const today = format(new Date(), 'yyyy-MM-dd');
  const currentMonth = format(new Date(), 'yyyy-MM');

  // Calculate stats based on user role
  const getStats = () => {
    if (user?.role === 'admin') {
      return {
        totalEmployees: employees.length,
        pendingLeaves: leaveRequests.filter(req => req.status === 'pending').length,
        presentToday: attendanceRecords.filter(rec => rec.date === today && rec.status === 'present').length,
        upcomingHolidays: holidays.filter(h => h.date >= today).slice(0, 3).length
      };
    } else if (user?.role === 'manager') {
      const teamMembers = employees.filter(emp => emp.managerId === user.id);
      return {
        teamSize: teamMembers.length,
        pendingApprovals: leaveRequests.filter(req => 
          req.status === 'pending' && 
          teamMembers.some(member => member.id === req.employeeId)
        ).length,
        teamPresentToday: attendanceRecords.filter(rec => 
          rec.date === today && 
          rec.status === 'present' &&
          teamMembers.some(member => member.id === rec.employeeId)
        ).length,
        upcomingHolidays: holidays.filter(h => h.date >= today).slice(0, 3).length
      };
    } else {
      const myLeaves = leaveRequests.filter(req => req.employeeId === user?.id);
      const myAttendance = attendanceRecords.filter(rec => rec.employeeId === user?.id);
      return {
        totalLeaves: myLeaves.length,
        pendingLeaves: myLeaves.filter(req => req.status === 'pending').length,
        monthlyAttendance: myAttendance.filter(rec => rec.date.startsWith(currentMonth)).length,
        upcomingHolidays: holidays.filter(h => h.date >= today).slice(0, 3).length
      };
    }
  };

  const stats = getStats();
  const upcomingHolidays = holidays.filter(h => h.date >= today).slice(0, 3);
  const recentLeaves = leaveRequests
    .filter(req => user?.role === 'employee' ? req.employeeId === user.id : true)
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  const getStatCards = () => {
    if (user?.role === 'admin') {
      return [
        { title: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'bg-blue-600' },
        { title: 'Pending Leaves', value: stats.pendingLeaves, icon: FileText, color: 'bg-yellow-600' },
        { title: 'Present Today', value: stats.presentToday, icon: CheckCircle, color: 'bg-green-600' },
        { title: 'Upcoming Holidays', value: stats.upcomingHolidays, icon: Calendar, color: 'bg-purple-600' }
      ];
    } else if (user?.role === 'manager') {
      return [
        { title: 'Team Size', value: stats.teamSize, icon: Users, color: 'bg-blue-600' },
        { title: 'Pending Approvals', value: stats.pendingApprovals, icon: AlertCircle, color: 'bg-orange-600' },
        { title: 'Team Present Today', value: stats.teamPresentToday, icon: CheckCircle, color: 'bg-green-600' },
        { title: 'Upcoming Holidays', value: stats.upcomingHolidays, icon: Calendar, color: 'bg-purple-600' }
      ];
    } else {
      return [
        { title: 'Total Leave Requests', value: stats.totalLeaves, icon: FileText, color: 'bg-blue-600' },
        { title: 'Pending Requests', value: stats.pendingLeaves, icon: Clock, color: 'bg-yellow-600' },
        { title: 'Monthly Attendance', value: stats.monthlyAttendance, icon: CheckCircle, color: 'bg-green-600' },
        { title: 'Upcoming Holidays', value: stats.upcomingHolidays, icon: Calendar, color: 'bg-purple-600' }
      ];
    }
  };

  const statCards = getStatCards();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/30';
      case 'rejected': return 'text-red-400 bg-red-900/30';
      default: return 'text-yellow-400 bg-yellow-900/30';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-400">
          Here's what's happening in your workplace today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-xl`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leave Requests */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Leave Requests</h2>
          <div className="space-y-4">
            {recentLeaves.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No recent leave requests</p>
            ) : (
              recentLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-white">{leave.employeeName}</p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{leave.type} • {leave.days} days</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Upcoming Holidays</h2>
          <div className="space-y-4">
            {upcomingHolidays.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No upcoming holidays</p>
            ) : (
              upcomingHolidays.map((holiday) => (
                <div key={holiday.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{holiday.name}</p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(holiday.date), 'EEEE, MMMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-yellow-400 capitalize">{holiday.type}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;