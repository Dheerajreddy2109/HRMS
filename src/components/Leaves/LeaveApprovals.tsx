import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, User, MessageCircle, Calendar } from 'lucide-react';

const LeaveApprovals: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, updateLeaveRequest, employees } = useData();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const getRelevantRequests = () => {
    let filteredRequests = leaveRequests;

    if (user?.role === 'manager') {
      const teamMembers = employees.filter(emp => emp.managerId === user.id);
      filteredRequests = leaveRequests.filter(req => 
        teamMembers.some(member => member.id === req.employeeId)
      );
    }

    if (filter !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.status === filter);
    }

    return filteredRequests.sort((a, b) => 
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    );
  };

  const handleApproval = (requestId: string, status: 'approved' | 'rejected') => {
    updateLeaveRequest(requestId, {
      status,
      approvedBy: user?.name || '',
      approvedDate: format(new Date(), 'yyyy-MM-dd'),
      comments: comments || undefined
    });
    setSelectedRequest(null);
    setComments('');
  };

  const relevantRequests = getRelevantRequests();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/30';
      case 'rejected': return 'text-red-400 bg-red-900/30';
      default: return 'text-yellow-400 bg-yellow-900/30';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'text-blue-400 bg-blue-900/30';
      case 'sick': return 'text-red-400 bg-red-900/30';
      case 'personal': return 'text-green-400 bg-green-900/30';
      case 'maternity': return 'text-purple-400 bg-purple-900/30';
      case 'emergency': return 'text-orange-400 bg-orange-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  if (user?.role === 'employee') {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <XCircle size={64} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Access Denied</p>
          <p className="text-gray-500">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Leave Approvals</h1>
        <p className="text-gray-400">
          Review and approve leave requests from {user?.role === 'admin' ? 'all employees' : 'your team'}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {status} ({relevantRequests.filter(req => status === 'all' || req.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {relevantRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-xl">
            <Clock size={64} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No leave requests found</p>
            <p className="text-gray-500">
              {filter === 'pending' ? 'No pending requests to review' : `No ${filter} requests`}
            </p>
          </div>
        ) : (
          relevantRequests.map((request) => (
            <div key={request.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <User size={24} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{request.employeeName}</h3>
                    <p className="text-sm text-gray-400">
                      Applied on {format(new Date(request.appliedDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLeaveTypeColor(request.type)}`}>
                    {request.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} className="text-yellow-400" />
                    <span className="text-sm text-gray-400">Start Date</span>
                  </div>
                  <p className="text-white font-medium">
                    {format(new Date(request.startDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} className="text-yellow-400" />
                    <span className="text-sm text-gray-400">End Date</span>
                  </div>
                  <p className="text-white font-medium">
                    {format(new Date(request.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={16} className="text-yellow-400" />
                    <span className="text-sm text-gray-400">Duration</span>
                  </div>
                  <p className="text-white font-medium">
                    {request.days} {request.days === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Reason</h4>
                <p className="text-white bg-gray-700 rounded-lg p-3">{request.reason}</p>
              </div>

              {request.comments && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Manager Comments</h4>
                  <p className="text-white bg-gray-700 rounded-lg p-3">{request.comments}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    By {request.approvedBy} on {request.approvedDate ? format(new Date(request.approvedDate), 'MMM dd, yyyy') : 'Unknown'}
                  </p>
                </div>
              )}

              {request.status === 'pending' && (
                <div>
                  {selectedRequest === request.id && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Comments (Optional)
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        rows={3}
                        placeholder="Add any comments for the employee..."
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    {selectedRequest === request.id ? (
                      <>
                        <button
                          onClick={() => handleApproval(request.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <CheckCircle size={18} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleApproval(request.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <XCircle size={18} />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(null);
                            setComments('');
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setSelectedRequest(request.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <MessageCircle size={18} />
                        <span>Review Request</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaveApprovals;