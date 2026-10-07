import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, Expense } from '../types';

interface MiniCalendarProps {
  tasks: Task[];
  expenses: Expense[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  isDark: boolean;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  tasks,
  expenses,
  selectedDate,
  onSelectDate,
  isDark,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // 0 = Sunday, 1 = Monday, ...
  // Let's align Monday = 0, Sunday = 6
  let startingWeekday = firstDayOfMonth.getDay() - 1;
  if (startingWeekday === -1) startingWeekday = 6;

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Check indicators for a specific date
  const getDateStatus = (day: number) => {
    const targetDate = new Date(year, month, day);
    const dayTasks = tasks.filter(t => isSameDay(new Date(t.startTime), targetDate));
    const dayExpenses = expenses.filter(e => isSameDay(new Date(e.startTime), targetDate));

    const hasTasks = dayTasks.length > 0;
    const allCompleted = hasTasks && dayTasks.every(t => t.progress >= 100);
    const hasUncompleted = hasTasks && dayTasks.some(t => t.progress < 100);
    const hasExpense = dayExpenses.length > 0;

    return {
      hasTasks,
      allCompleted,
      hasUncompleted,
      hasExpense,
    };
  };

  const today = new Date();

  return (
    <div
      className={`rounded-2xl p-4 transition-colors ${
        isDark
          ? 'bg-[#18181b] border border-white/20 text-white'
          : 'bg-white border border-neutral-300 text-neutral-900 shadow-xs'
      }`}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-tight">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
            title="Tháng trước"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
            title="Tháng sau"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Legend Indicators */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-3 mb-3 border-b text-[11px] border-inherit">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" />
          <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>Việc chưa xong</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 inline-block" />
          <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>Việc đã xong</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 inline-block" />
          <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>Có sinh hoạt</span>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold mb-2">
        {weekdays.map((w, idx) => (
          <div
            key={idx}
            className={`py-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Blank cells for starting weekday */}
        {Array.from({ length: startingWeekday }).map((_, i) => (
          <div key={`blank-${i}`} className="h-10" />
        ))}

        {/* Days in Month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentDay = isSameDay(date, today);
          const { allCompleted, hasUncompleted, hasExpense } = getDateStatus(day);

          return (
            <button
              key={`day-${day}`}
              onClick={() => onSelectDate(date)}
              className={`h-10 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-white text-neutral-950 font-bold shadow-xs'
                    : 'bg-neutral-950 text-white font-bold shadow-xs'
                  : isCurrentDay
                  ? isDark
                    ? 'bg-white/10 text-white font-medium ring-1 ring-white/30'
                    : 'bg-neutral-100 text-neutral-900 font-medium ring-1 ring-neutral-400'
                  : isDark
                  ? 'hover:bg-white/10 text-neutral-200'
                  : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <span className="text-xs leading-none tabular-nums">{day}</span>

              {/* Dots indicator row */}
              <div className="flex items-center gap-0.5 mt-1 h-1.5">
                {/* Task indicator: Red if any uncompleted, Green if all completed */}
                {hasUncompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                )}
                {allCompleted && !hasUncompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                )}

                {/* Expense indicator: Gold / Amber */}
                {hasExpense && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
