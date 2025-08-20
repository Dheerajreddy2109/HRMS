import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format, differenceInDays } from 'date-fns';
import { FileText, Send, Calendar } from 'lucide-react';

const LeaveRequest: React.FC = () => {
  const { user } = useAuth();
  const { addLeaveRequest } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'annual' as 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const days = differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1;

    const leaveRequest = {
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'pending' as const,
      appliedDate: format(new Date(), 'yyyy-MM-dd')
    };

    addLeaveRequest(leaveRequest);
    
    setSuccess(true);
    setFormData({
      type: 'annual',
      startDate: '',
      endDate: '',
      reason: ''
    });

    setTimeout(() => {
      setSuccess(false);
    }, 3000);

    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const days = differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'text-blue-400';
      case 'sick': return 'text-red-400';
      case 'personal': return 'text-green-400';
      case 'maternity': return 'text-purple-400';
      case 'emergency': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Request Leave</h1>
        <p className="text-gray-400">
          Submit a new leave request for approval
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white">Leave Application</h2>
          </div>

          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6">
              Leave request submitted successfully! You will be notified once it's reviewed.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Leave Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="emergency">Emergency Leave</option>
              </select>
              <p className={`text-xs mt-1 capitalize ${getLeaveTypeColor(formData.type)}`}>
                {formData.type} leave selected
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} className="text-yellow-400" />
                    <span className="text-white font-medium">Duration</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">
                    {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                placeholder="Please provide a reason for your leave request..."
                required
              />
            </div>

            <div className="pt-6 border-t border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting || calculateDays() <= 0}
                className="w-full bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Submit Leave Request</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">
              <strong>Note:</strong> Your leave request will be sent to your manager for approval.
            </p>
            <p className="text-xs text-gray-400">
              You will receive a notification once your request is reviewed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;