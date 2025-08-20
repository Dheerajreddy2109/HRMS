
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format, isAfter, isBefore } from 'date-fns';
import { Calendar, Plus, Trash2, CalendarDays } from 'lucide-react';

const Holidays: React.FC = () => {
  const { user } = useAuth();
  const { holidays, addHoliday, removeHoliday } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'public' as 'public' | 'company' | 'optional',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHoliday(formData);
    setFormData({
      name: '',
      date: '',
      type: 'public',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFilteredHolidays = () => {
    const today = new Date();
    let filtered = holidays;

    switch (filter) {
      case 'upcoming':
        filtered = holidays.filter(h => isAfter(new Date(h.date), today));
        break;
      case 'past':
        filtered = holidays.filter(h => isBefore(new Date(h.date), today));
        break;
      default:
        filtered = holidays;
    }

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredHolidays = getFilteredHolidays();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'text-blue-400 bg-blue-900/30';
      case 'company': return 'text-green-400 bg-green-900/30';
      case 'optional': return 'text-yellow-400 bg-yellow-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const isUpcoming = (date: string) => {
    return isAfter(new Date(date), new Date());
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Holiday Calendar</h1>
            <p className="text-gray-400">
              View company holidays and important dates
            </p>
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add Holiday</span>
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Add New Holiday</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Holiday Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="e.g. Christmas Day"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="public">Public Holiday</option>
                <option value="company">Company Holiday</option>
                <option value="optional">Optional Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                placeholder="Optional description..."
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Add Holiday
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="flex space-x-4">
          {(['all', 'upcoming', 'past'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === filterType
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filterType === 'all' ? 'All Holidays' : filterType}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHolidays.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <CalendarDays size={64} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No holidays found</p>
          </div>
        ) : (
          filteredHolidays.map((holiday) => (
            <div
              key={holiday.id}
              className={`bg-gray-800 border rounded-xl p-6 hover:border-yellow-400 transition-colors ${
                isUpcoming(holiday.date) ? 'border-yellow-400/50' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{holiday.name}</h3>
                    <p className="text-sm text-gray-400">
                      {format(new Date(holiday.date), 'EEEE, MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <button
                    onClick={() => removeHoliday(holiday.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(holiday.type)}`}>
                    {holiday.type}
                  </span>
                </div>

                {isUpcoming(holiday.date) && (
                  <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
                    <p className="text-yellow-400 text-sm font-medium flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Upcoming Holiday</span>
                    </p>
                  </div>
                )}

                {holiday.description && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Description</p>
                    <p className="text-white text-sm">{holiday.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Holidays;