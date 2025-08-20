import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format, isToday } from 'date-fns';
import { Clock, Play, Square, Calendar, User } from 'lucide-react';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const { attendanceRecords, addAttendanceRecord, updateAttendanceRecord, employees } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecord = attendanceRecords.find(
      record => record.employeeId === user?.id && record.date === today
    );
    setIsWorking(todayRecord?.clockIn && !todayRecord?.clockOut);
  }, [attendanceRecords, user?.id]);

  const handleClockIn = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const now = format(new Date(), 'HH:mm:ss');
    
    addAttendanceRecord({
      employeeId: user?.id || '',
      date: today,
      clockIn: now,
      status: 'present'
    });
    setIsWorking(true);
  };

  const handleClockOut = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const now = format(new Date(), 'HH:mm:ss');
    
    const todayRecord = attendanceRecords.find(
      record => record.employeeId === user?.id && record.date === today
    );

    if (todayRecord) {
      const clockInTime = new Date(`${today} ${todayRecord.clockIn}`);
      const clockOutTime = new Date(`${today} ${now}`);
      const workingHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

      updateAttendanceRecord(todayRecord.id, {
        clockOut: now,
        workingHours: parseFloat(workingHours.toFixed(2))
      });
    }
    setIsWorking(false);
  };

  const getTodayRecord = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return attendanceRecords.find(
      record => record.employeeId === user?.id && record.date === today
    );
  };

  const getRecentRecords = () => {
    if (user?.role === 'employee') {
      return attendanceRecords
        .filter(record => record.employeeId === user.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7);
    } else {
      const relevantEmployees = user?.role === 'admin' 
        ? employees 
        : employees.filter(emp => emp.managerId === user?.id);
      
      return attendanceRecords
        .filter(record => relevantEmployees.some(emp => emp.id === record.employeeId))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    }
  };

  const todayRecord = getTodayRecord();
  const recentRecords = getRecentRecords();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-400 bg-green-900/30';
      case 'absent': return 'text-red-400 bg-red-900/30';
      case 'half-day': return 'text-yellow-400 bg-yellow-900/30';
      case 'late': return 'text-orange-400 bg-orange-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Attendance Management</h1>
        <p className="text-gray-400">
          Track your work hours and manage attendance
        </p>
      </div>

      {user?.role === 'employee' && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={48} className="text-black" />
            </div>
            
            <div className="mb-6">
              <p className="text-4xl font-bold text-white mb-2">
                {format(currentTime, 'HH:mm:ss')}
              </p>
              <p className="text-xl text-gray-400">
                {format(currentTime, 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>

            {todayRecord ? (
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Clock In</p>
                    <p className="text-xl font-bold text-green-400">
                      {todayRecord.clockIn || '--:--'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Clock Out</p>
                    <p className="text-xl font-bold text-red-400">
                      {todayRecord.clockOut || '--:--'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Working Hours</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {todayRecord.workingHours ? `${todayRecord.workingHours}h` : '--:--'}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex justify-center space-x-4">
              {!isWorking ? (
                <button
                  onClick={handleClockIn}
                  disabled={!!todayRecord?.clockIn}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center space-x-2 transition-colors disabled:cursor-not-allowed"
                >
                  <Play size={20} />
                  <span>Clock In</span>
                </button>
              ) : (
                <button
                  onClick={handleClockOut}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Square size={20} />
                  <span>Clock Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          {user?.role === 'employee' ? 'Your Attendance History' : 'Team Attendance'}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                {user?.role !== 'employee' && (
                  <th className="pb-3 text-gray-400 font-medium">Employee</th>
                )}
                <th className="pb-3 text-gray-400 font-medium">Date</th>
                <th className="pb-3 text-gray-400 font-medium">Clock In</th>
                <th className="pb-3 text-gray-400 font-medium">Clock Out</th>
                <th className="pb-3 text-gray-400 font-medium">Hours</th>
                <th className="pb-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentRecords.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'employee' ? 5 : 6} className="py-8 text-center text-gray-400">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                recentRecords.map((record) => {
                  const employee = employees.find(emp => emp.id === record.employeeId);
                  return (
                    <tr key={record.id} className="hover:bg-gray-700/50 transition-colors">
                      {user?.role !== 'employee' && (
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                              <User size={16} className="text-black" />
                            </div>
                            <span className="text-white">{employee?.name || 'Unknown'}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-4 text-white">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-yellow-400" />
                          <span>{format(new Date(record.date), 'MMM dd, yyyy')}</span>
                          {isToday(new Date(record.date)) && (
                            <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-medium">
                              Today
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-green-400 font-medium">
                        {record.clockIn || '--:--'}
                      </td>
                      <td className="py-4 text-red-400 font-medium">
                        {record.clockOut || '--:--'}
                      </td>
                      <td className="py-4 text-yellow-400 font-medium">
                        {record.workingHours ? `${record.workingHours}h` : '--'}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;