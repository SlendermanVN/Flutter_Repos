import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Layers, 
  Wallet, 
  Briefcase, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  X,
  AlertCircle
} from 'lucide-react';
import { Task, Expense, TimePeriod } from '../types';
import { MiniCalendar } from './MiniCalendar';

interface WorksTabProps {
  tasks: Task[];
  expenses: Expense[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddExpense: (expense: Expense) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  isDark: boolean;
}

export const WorksTab: React.FC<WorksTabProps> = ({
  tasks,
  expenses,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  isDark,
}) => {
  // Mode: 'tasks' (Quản lý công việc) | 'expenses' (Quản lý sinh hoạt)
  const [activeMode, setActiveMode] = useState<'tasks' | 'expenses'>('tasks');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bottomPeriod, setBottomPeriod] = useState<TimePeriod>('month');

  // Modal State for CRUD
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form states for Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Dự án');
  const [taskValue, setTaskValue] = useState('');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskNotes, setTaskNotes] = useState('');

  // Form states for Expense
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Ăn uống');
  const [expenseValue, setExpenseValue] = useState('');
  const [expenseStartDate, setExpenseStartDate] = useState('');
  const [expenseEndDate, setExpenseEndDate] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');

  // Filter tasks & expenses for selectedDate
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const filteredTasks = tasks.filter(t => isSameDay(new Date(t.startTime), selectedDate));
  const filteredExpenses = expenses.filter(e => isSameDay(new Date(e.startTime), selectedDate));

  // Open Task Modal
  const openNewTaskModal = () => {
    const dStr = selectedDate.toISOString().slice(0, 16);
    setEditingTask(null);
    setTaskTitle('');
    setTaskCategory('Dự án');
    setTaskValue('25000000');
    setTaskStartDate(dStr);
    setTaskEndDate(dStr);
    setTaskProgress(0);
    setTaskNotes('');
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskCategory(task.category);
    setTaskValue(task.value);
    setTaskStartDate(new Date(task.startTime).toISOString().slice(0, 16));
    setTaskEndDate(new Date(task.endTime).toISOString().slice(0, 16));
    setTaskProgress(task.progress);
    setTaskNotes(task.notes || '');
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: taskTitle.trim(),
        category: taskCategory.trim(),
        value: taskValue.trim(),
        startTime: new Date(taskStartDate).toISOString(),
        endTime: new Date(taskEndDate).toISOString(),
        progress: taskProgress,
        notes: taskNotes.trim(),
      });
    } else {
      onAddTask({
        id: `tsk_${Date.now()}`,
        title: taskTitle.trim(),
        category: taskCategory.trim(),
        value: taskValue.trim(),
        valueType: isNaN(Number(taskValue)) ? 'text' : 'number',
        startTime: new Date(taskStartDate).toISOString(),
        endTime: new Date(taskEndDate).toISOString(),
        progress: taskProgress,
        notes: taskNotes.trim(),
      });
    }
    setIsTaskModalOpen(false);
  };

  // Open Expense Modal
  const openNewExpenseModal = () => {
    const dStr = selectedDate.toISOString().slice(0, 16);
    setEditingExpense(null);
    setExpenseTitle('');
    setExpenseCategory('Ăn uống');
    setExpenseValue('450000');
    setExpenseStartDate(dStr);
    setExpenseEndDate(dStr);
    setExpenseNotes('');
    setIsExpenseModalOpen(true);
  };

  const openEditExpenseModal = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseTitle(expense.title);
    setExpenseCategory(expense.category);
    setExpenseValue(expense.value);
    setExpenseStartDate(new Date(expense.startTime).toISOString().slice(0, 16));
    setExpenseEndDate(new Date(expense.endTime).toISOString().slice(0, 16));
    setExpenseNotes(expense.notes || '');
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim()) return;

    if (editingExpense) {
      onUpdateExpense({
        ...editingExpense,
        title: expenseTitle.trim(),
        category: expenseCategory.trim(),
        value: expenseValue.trim(),
        startTime: new Date(expenseStartDate).toISOString(),
        endTime: new Date(expenseEndDate).toISOString(),
        notes: expenseNotes.trim(),
      });
    } else {
      onAddExpense({
        id: `exp_${Date.now()}`,
        title: expenseTitle.trim(),
        category: expenseCategory.trim(),
        value: expenseValue.trim(),
        valueType: isNaN(Number(expenseValue)) ? 'text' : 'number',
        startTime: new Date(expenseStartDate).toISOString(),
        endTime: new Date(expenseEndDate).toISOString(),
        notes: expenseNotes.trim(),
      });
    }
    setIsExpenseModalOpen(false);
  };

  // Bottom stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.progress >= 100).length;
  const uncompletedTasks = totalTasks - completedTasks;
  const totalExpenseSum = expenses.reduce((sum, e) => sum + (parseFloat(e.value) || 0), 0);

  const formatVnd = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. NÚT CHUYỂN ĐỔI PHẦN QUẢN LÝ CÔNG VIỆC VÀ SINH HOẠT NẰM TRÊN CÙNG Ở GIỮA */}
      <div className="flex justify-center">
        <div
          className={`inline-flex items-center p-1.5 rounded-2xl transition-all ${
            isDark
              ? 'bg-[#18181b] border border-white/20'
              : 'bg-white border border-neutral-300 shadow-xs'
          }`}
        >
          <button
            onClick={() => setActiveMode('tasks')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'tasks'
                ? isDark
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'bg-neutral-950 text-white shadow-xs'
                : isDark
                ? 'text-neutral-400 hover:text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Briefcase size={15} />
            Quản lý công việc
          </button>

          <button
            onClick={() => setActiveMode('expenses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'expenses'
                ? isDark
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'bg-neutral-950 text-white shadow-xs'
                : isDark
                ? 'text-neutral-400 hover:text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Wallet size={15} />
            Quản lý sinh hoạt
          </button>
        </div>
      </div>

      {/* 2. NỘI DUNG CHÍNH: LỊCH THU NHỎ & DANH SÁCH CRUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mini Calendar & Selected Date Summary */}
        <div className="lg:col-span-4 space-y-4">
          <MiniCalendar
            tasks={tasks}
            expenses={expenses}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            isDark={isDark}
          />

          {/* Card hiển thị ngày được chọn */}
          <div
            className={`p-4 rounded-2xl ${
              isDark
                ? 'bg-[#18181b] border border-white/20'
                : 'bg-white border border-neutral-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Ngày đang lọc
              </span>
              <span className={`text-xs font-bold tabular-nums ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Công việc:</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {filteredTasks.length} việc ({filteredTasks.filter(t => t.progress >= 100).length} xong)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Mục sinh hoạt:</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {filteredExpenses.length} mục
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: CRUD Lists */}
        <div className="lg:col-span-8">
          <div
            className={`p-6 rounded-2xl ${
              isDark
                ? 'bg-[#18181b] border border-white/20'
                : 'bg-white border border-neutral-300 shadow-xs'
            }`}
          >
            {/* Header with Title and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-inherit">
              <div>
                <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {activeMode === 'tasks' ? 'Danh sách công việc' : 'Danh sách sinh hoạt & chi tiêu'}
                </h2>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {activeMode === 'tasks'
                    ? 'Bao gồm tên, loại, giá trị (chữ, số), ngày giờ và mức độ hoàn thành %'
                    : 'Bao gồm tên, loại, giá trị (chữ, số), giờ - ngày bắt đầu và kết thúc'}
                </p>
              </div>

              <button
                onClick={activeMode === 'tasks' ? openNewTaskModal : openNewExpenseModal}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto ${
                  isDark
                    ? 'bg-white text-neutral-950 hover:bg-neutral-100 shadow-xs'
                    : 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-xs'
                }`}
              >
                <Plus size={15} />
                {activeMode === 'tasks' ? 'Thêm công việc' : 'Thêm sinh hoạt'}
              </button>
            </div>

            {/* Content List */}
            {activeMode === 'tasks' ? (
              filteredTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <Briefcase className={`w-10 h-10 mx-auto mb-2 opacity-40 ${isDark ? 'text-white' : 'text-neutral-900'}`} />
                  <p className={`text-sm font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Không có công việc nào trong ngày này.
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    Nhấn "Thêm công việc" để lập kế hoạch ngay cho ngày {selectedDate.toLocaleDateString('vi-VN')}.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/70 border-neutral-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                task.progress >= 100 ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                              {task.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              Loại: {task.category}
                            </span>
                            <span>·</span>
                            <span>
                              Giá trị: <strong className="text-neutral-900 dark:text-white font-mono">{task.value}</strong>
                            </span>
                            <span>·</span>
                            <span>
                              {formatDateTime(task.startTime)} → {formatDateTime(task.endTime)}
                            </span>
                          </div>
                          {task.notes && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                              Ghi chú: {task.notes}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditTaskModal(task)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-700'
                            }`}
                            title="Sửa công việc"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer text-red-500 hover:bg-red-500/10"
                            title="Xóa công việc"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* MỨC ĐỘ HOÀN THÀNH (%) - CHỈ CÓ Ở MỤC QUẢN LÝ CÔNG VIỆC */}
                      <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                            <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
                              Mức độ hoàn thành:
                            </span>
                            <span
                              className={`tabular-nums font-bold ${
                                task.progress >= 100 ? 'text-emerald-500' : 'text-red-500'
                              }`}
                            >
                              {task.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                task.progress >= 100 ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onUpdateTask({
                              ...task,
                              progress: task.progress >= 100 ? 0 : 100,
                            });
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                            task.progress >= 100
                              ? isDark
                                ? 'border-white/20 text-neutral-300 hover:bg-white/10'
                                : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                              : 'border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                        >
                          {task.progress >= 100 ? 'Làm lại' : 'Xong ngay'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              filteredExpenses.length === 0 ? (
                <div className="py-12 text-center">
                  <Wallet className={`w-10 h-10 mx-auto mb-2 opacity-40 ${isDark ? 'text-white' : 'text-neutral-900'}`} />
                  <p className={`text-sm font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Không có khoản sinh hoạt nào trong ngày này.
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    Nhấn "Thêm sinh hoạt" để ghi nhận chi tiêu hoặc hoạt động đời sống.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/70 border-neutral-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                              {exp.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              Loại: {exp.category}
                            </span>
                            <span>·</span>
                            <span>
                              Giá trị:{' '}
                              <strong className="text-amber-500 font-mono font-bold">
                                {!isNaN(Number(exp.value)) ? formatVnd(Number(exp.value)) : exp.value}
                              </strong>
                            </span>
                            <span>·</span>
                            <span>
                              {formatDateTime(exp.startTime)} → {formatDateTime(exp.endTime)}
                            </span>
                          </div>
                          {exp.notes && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                              Ghi chú: {exp.notes}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditExpenseModal(exp)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-700'
                            }`}
                            title="Sửa sinh hoạt"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => onDeleteExpense(exp.id)}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer text-red-500 hover:bg-red-500/10"
                            title="Xóa sinh hoạt"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 3. MỤC THỐNG KÊ SỐ LƯỢNG CÔNG VIỆC, CHI TIÊU Ở CUỐI TỔNG HỢP HÀNG TUẦN/THÁNG/NĂM */}
      <div
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-[#18181b] border border-white/20'
            : 'bg-white border border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-inherit">
          <div>
            <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Thống kê tổng hợp số lượng công việc &amp; chi tiêu
            </h2>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Tổng hợp dữ liệu theo chu kỳ hiện tại ({bottomPeriod === 'week' ? 'Tuần này' : bottomPeriod === 'month' ? 'Tháng này' : 'Năm nay'})
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-inherit bg-neutral-100/50 dark:bg-white/5 self-start sm:self-auto">
            <button
              onClick={() => setBottomPeriod('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bottomPeriod === 'week'
                  ? isDark
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-950 text-white shadow-xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Hàng tuần
            </button>
            <button
              onClick={() => setBottomPeriod('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bottomPeriod === 'month'
                  ? isDark
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-950 text-white shadow-xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => setBottomPeriod('year')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bottomPeriod === 'year'
                  ? isDark
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-950 text-white shadow-xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Hàng năm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/70 border-neutral-200'
            }`}
          >
            <div className="text-xs text-neutral-500 mb-1 font-medium">Số lượng công việc</div>
            <div className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {totalTasks} <span className="text-xs font-normal text-neutral-400">việc</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {completedTasks} hoàn thành · {uncompletedTasks} chưa hoàn thành
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/70 border-neutral-200'
            }`}
          >
            <div className="text-xs text-neutral-500 mb-1 font-medium">Tổng chi tiêu sinh hoạt</div>
            <div className="text-2xl font-bold tabular-nums text-amber-500">
              {formatVnd(totalExpenseSum)}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {expenses.length} khoản chi phí trong chu kỳ
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/70 border-neutral-200'
            }`}
          >
            <div className="text-xs text-neutral-500 mb-1 font-medium">Hiệu suất hoàn thành</div>
            <div className="text-2xl font-bold tabular-nums text-emerald-500">
              {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Đạt chỉ tiêu theo kế hoạch đề ra
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CRUD TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl transition-all ${
              isDark
                ? 'bg-[#1c1c1f] border border-white/20 text-white'
                : 'bg-white border border-neutral-300 text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
              <h3 className="text-base font-bold">
                {editingTask ? 'Chỉnh sửa công việc' : 'Tạo mới công việc'}
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Tên công việc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Ví dụ: Hoàn thiện frontend Flutter Desktop..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    isDark
                      ? 'bg-neutral-900 border-white/20 focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 focus:border-black'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Loại công việc</label>
                  <input
                    type="text"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    placeholder="Dự án, Họp, Học tập..."
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                      isDark
                        ? 'bg-neutral-900 border-white/20 focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 focus:border-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Giá trị (Chữ hoặc số)
                  </label>
                  <input
                    type="text"
                    value={taskValue}
                    onChange={(e) => setTaskValue(e.target.value)}
                    placeholder="25000000 hoặc Cấp A"
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-mono ${
                      isDark
                        ? 'bg-neutral-900 border-white/20 focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 focus:border-black'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Giờ - ngày bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={taskStartDate}
                    onChange={(e) => setTaskStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                      isDark
                        ? 'bg-neutral-900 border-white/20 focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 focus:border-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Giờ - ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    value={taskEndDate}
                    onChange={(e) => setTaskEndDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                      isDark
                        ? 'bg-neutral-900 border-white/20 focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 focus:border-black'
                    }`}
                  />
                </div>
              </div>

              {/* Mức độ hoàn thành - CHỈ CÓ Ở CÔNG VIỆC */}
              <div className="p-3 rounded-xl border border-inherit bg-neutral-100/40 dark:bg-white/5">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span>Mức độ hoàn thành (%):</span>
                  <span className="text-emerald-500 font-mono text-sm">{taskProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={taskProgress}
                  onChange={(e) => setTaskProgress(Number(e.target.value))}
                  className="w-full cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>0% Chưa làm</span>
                  <span>50% Đang làm</span>
                  <span>100% Hoàn thành</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Ghi chú thêm</label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="Ghi chú chi tiết..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    isDark
                      ? 'bg-neutral-900 border-white/20 focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 focus:border-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isDark
                      ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                      : 'bg-neutral-950 text-white hover:bg-neutral-800'
                  }`}
                >
                  Lưu công việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CRUD EXPENSE */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl transition-all ${
              isDark
                ? 'bg-[#1c1c1f] border border-white/20 text-white'
                : 'bg-white border border-neutral-300 text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
              <h3 className="text-base font-bold">
                {editingExpense ? 'Chỉnh sửa sinh hoạt' : 'Ghi nhận sinh hoạt mới'}
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Tên sinh hoạt / khoản chi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="Ví dụ: Đi siêu thị thực phẩm, trả tiền nhà..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    isDark
                      ? 'bg-neutral-900 border-white/20 focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 focus:border-black'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Loại sinh hoạt</label>
                  <input
                    type="text"
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    placeholder="Ăn uống, Tiền nhà, Hóa đơn..."
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                      isDark
                        ? 'bg-neutral-900 border-white/20 focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 focus:border-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Giá trị (Chữ hoặc số)
                  </label>
                  <input
                    type="text"
                    value={expenseValue}
                    onChange={(e) => setExpenseValue(e.target.value)}
                    placeholder="450000 hoặc Mua đồ gia dụng"
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-mono ${
                      isDark
                        ? 'bg-neutral-900 border-white/20 focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 focus:border-black'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Giờ - ngày bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={expenseStartDate}
                    onChange={(e) => setExpenseStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                      isDark
                        ? 'bg-neutral-900 border-white/20 focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 focus:border-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Giờ - ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    value={expenseEndDate}
                    onChange={(e) => setExpenseEndDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                      isDark
                        ? 'bg-neutral-900 border-white/20 focus:border-white'
                        : 'bg-neutral-50 border-neutral-300 focus:border-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Ghi chú thêm</label>
                <textarea
                  rows={2}
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="Ghi chú hóa đơn hoặc địa điểm..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                    isDark
                      ? 'bg-neutral-900 border-white/20 focus:border-white'
                      : 'bg-neutral-50 border-neutral-300 focus:border-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isDark
                      ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                      : 'bg-neutral-950 text-white hover:bg-neutral-800'
                  }`}
                >
                  Lưu sinh hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
