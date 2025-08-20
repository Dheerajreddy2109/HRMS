import React, { createContext, useContext, useEffect, useState } from 'react';
import { LeaveRequest, AttendanceRecord, Holiday, User } from '../types';
import { api } from '../lib/api';

interface DataContextType {
  leaveRequests: LeaveRequest[];
  attendanceRecords: AttendanceRecord[];
  holidays: Holiday[];
  employees: User[];
  addLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => Promise<void>;
  updateLeaveRequest: (id: number, updates: Partial<LeaveRequest>) => Promise<void>;
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  updateAttendanceRecord: (id: number, updates: Partial<AttendanceRecord>) => Promise<void>;
  addHoliday: (holiday: Omit<Holiday, 'id'>) => Promise<void>;
  removeHoliday: (id: number) => Promise<void>;
  refreshEmployees: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};

export const DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);

  // Initial load
  useEffect(() => {
    (async () => {
      const [emps, leaves, atts, hols] = await Promise.all([
        api.employees.list(), api.leaves.list(), api.attendance.list(), api.holidays.list()
      ]);
      setEmployees(emps as any);
      setLeaveRequests(leaves as any);
      setAttendanceRecords(atts as any);
      setHolidays(hols as any);
    })();
  }, []);

  const refreshEmployees = async () => {
    const emps = await api.employees.list();
    setEmployees(emps as any);
  };

  const addLeaveRequest = async (req: Omit<LeaveRequest, 'id'>) => {
    const { id } = await api.leaves.create({
      employeeId: req.employeeId,
      employeeName: req.employeeName,
      type: req.type,
      startDate: req.startDate,
      endDate: req.endDate,
      days: req.days,
      reason: req.reason ?? '',
      appliedDate: req.appliedDate,
    });
    setLeaveRequests(prev => [{ ...req, id: String(id), status: 'pending' } as any, ...prev]);
  };

  const updateLeaveRequest = async (id: number, updates: Partial<LeaveRequest>) => {
    await api.leaves.update(id, updates);
    setLeaveRequests(prev => prev.map(l => Number(l.id) === id ? { ...l, ...updates } : l));
  };

  const addAttendanceRecord = async (record: Omit<AttendanceRecord, 'id'>) => {
    await api.attendance.upsert(record);
    setAttendanceRecords(prev => [{ ...(record as any), id: String(Date.now()) }, ...prev]);
  };

  const updateAttendanceRecord = async (id: number, updates: Partial<AttendanceRecord>) => {
    const existing = attendanceRecords.find(r => Number(r.id) === id);
    if (!existing) return;
    await api.attendance.upsert({ ...existing, ...updates });
    setAttendanceRecords(prev => prev.map(r => Number(r.id) === id ? { ...r, ...updates } : r));
  };

  const addHoliday = async (holiday: Omit<Holiday, 'id'>) => {
    const { id } = await api.holidays.create(holiday);
    setHolidays(prev => [...prev, { ...holiday, id: String(id) } as any]);
  };

  const removeHoliday = async (id: number) => {
    await api.holidays.remove(id);
    setHolidays(prev => prev.filter(h => Number(h.id) !== id));
  };

  return (
    <DataContext.Provider value={{
      leaveRequests, attendanceRecords, holidays, employees,
      addLeaveRequest, updateLeaveRequest,
      addAttendanceRecord, updateAttendanceRecord,
      addHoliday, removeHoliday, refreshEmployees
    }}>
      {children}
    </DataContext.Provider>
  );
};