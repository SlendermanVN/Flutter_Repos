import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Briefcase, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  Smartphone, 
  FileText,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { Task, Expense, ThemeMode, DeviceView } from './types';
import { initialTasks, initialExpenses } from './data/initialData';
import { HomeTab } from './components/HomeTab';
import { WorksTab } from './components/WorksTab';
import { StatisticsTab } from './components/StatisticsTab';
import { SettingsTab } from './components/SettingsTab';
import { ApiSpecModal } from './components/ApiSpecModal';

export default function App() {
  // Navigation: 0 = Home, 1 = Works, 2 = Statistics, 3 = Settings
  const [currentTab, setCurrentTab] = useState<number>(0);
  
  // Theme mode: light or dark (Strictly follows user specification:
  // Sáng: tông màu trắng chủ đạo, đen xám viền
  // Tối: tông màu đen xám chủ đạo, trắng viền)
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  
  // Device simulator view: 'desktop' or 'mobile'
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  
  // Modal for API specs
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  // Data state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('wl_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('wl_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  useEffect(() => {
    localStorage.setItem('wl_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('wl_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // CRUD Handlers for Task
  const handleAddTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const handleUpdateTask = (task: Task) => {
    setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // CRUD Handlers for Expense
  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const handleUpdateExpense = (expense: Expense) => {
    setExpenses(prev => prev.map(e => (e.id === expense.id ? expense : e)));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const isDark = themeMode === 'dark';

  const navItems = [
    { label: 'Trang chủ', icon: Home, index: 0 },
    { label: 'Công việc & Sinh hoạt', icon: Briefcase, index: 1 },
    { label: 'Tổng hợp & Thống kê', icon: BarChart3, index: 2 },
    { label: 'Cài đặt hệ thống', icon: Settings, index: 3 },
  ];

  // Render the current view
  const renderCurrentView = () => {
    switch (currentTab) {
      case 0:
        return (
          <HomeTab
            tasks={tasks}
            expenses={expenses}
            onNavigateToWorks={() => setCurrentTab(1)}
            onNavigateToStats={() => setCurrentTab(2)}
            isDark={isDark}
          />
        );
      case 1:
        return (
          <WorksTab
            tasks={tasks}
            expenses={expenses}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            isDark={isDark}
          />
        );
      case 2:
        return (
          <StatisticsTab
            tasks={tasks}
            expenses={expenses}
            isDark={isDark}
          />
        );
      case 3:
        return (
          <SettingsTab
            themeMode={themeMode}
            onThemeModeChange={setThemeMode}
            onOpenApiSpec={() => setIsApiModalOpen(true)}
            isDark={isDark}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        isDark
          ? 'bg-[#121212] text-white selection:bg-white selection:text-black'
          : 'bg-[#F9FAFB] text-neutral-900 selection:bg-black selection:text-white'
      }`}
    >
      {/* TOP CONTROL BAR: Device Mode Switcher (Desktop App vs Mobile App) + Theme Switcher + API Docs Button */}
      <div
        className={`sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between text-xs backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#121212]/90 border-b border-white/20'
            : 'bg-white/90 border-b border-neutral-300 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              W
            </div>
            <span className="font-bold tracking-tight text-sm hidden sm:inline">
              WorkLife Manager
            </span>
          </div>

          <span className="text-neutral-400 hidden sm:inline">|</span>

          {/* Device view switcher (Desktop vs Mobile simulator) */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-inherit bg-neutral-100/50 dark:bg-white/5">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                deviceView === 'desktop'
                  ? isDark
                    ? 'bg-white text-black font-bold shadow-2xs'
                    : 'bg-black text-white font-bold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Monitor size={13} />
              <span className="hidden md:inline">Giao diện</span> Desktop App
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                deviceView === 'mobile'
                  ? isDark
                    ? 'bg-white text-black font-bold shadow-2xs'
                    : 'bg-black text-white font-bold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Smartphone size={13} />
              <span className="hidden md:inline">Giao diện</span> Mobile App
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick open API Spec */}
          <button
            onClick={() => setIsApiModalOpen(true)}
            className={`px-2.5 py-1.5 rounded-lg border border-inherit flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
              isDark
                ? 'hover:bg-white/10 text-neutral-200'
                : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Xem file api_specifications.txt và Flutter code"
          >
            <FileText size={13} className="text-emerald-500" />
            <span className="hidden sm:inline">Đặc tả API &amp; Flutter Code</span>
            <span className="sm:hidden">API/Code</span>
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className={`p-1.5 rounded-lg border border-inherit transition-all cursor-pointer ${
              isDark
                ? 'hover:bg-white/10 text-amber-400'
                : 'hover:bg-neutral-100 text-neutral-800'
            }`}
            title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* RENDER DESKTOP OR MOBILE SIMULATION */}
      {deviceView === 'desktop' ? (
        /* GIAO DIỆN DESKTOP APP: Dashboard sidebar ở phía bên trái */
        <div className="flex min-h-[calc(100vh-45px)]">
          {/* Left Desktop Sidebar */}
          <aside
            className={`w-64 shrink-0 transition-colors hidden md:flex flex-col border-r ${
              isDark
                ? 'bg-[#18181b] border-white/20'
                : 'bg-white border-neutral-300'
            }`}
          >
            {/* Sidebar Brand Header */}
            <div className="p-5 border-b border-inherit">
              <div className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-1">
                Dashboard Điều Khiển
              </div>
              <div className="font-bold text-base tracking-tight flex items-center gap-2">
                <span>WorkLife Desktop</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono font-normal">
                  v1.0
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="p-3 space-y-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentTab === item.index;
                return (
                  <button
                    key={item.index}
                    onClick={() => setCurrentTab(item.index)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      active
                        ? isDark
                          ? 'bg-white text-neutral-950 font-bold shadow-xs'
                          : 'bg-neutral-950 text-white font-bold shadow-xs'
                        : isDark
                        ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick user status footer */}
            <div className="p-4 border-t border-inherit m-3 rounded-xl bg-neutral-100/50 dark:bg-white/5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isDark ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-900'
                  }`}
                >
                  Đ
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold truncate">Nguyễn Lê Anh Đức</div>
                  <div className="text-[10px] text-neutral-400 truncate">Hệ thống sẵn sàng</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Desktop Main Content Area */}
          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderCurrentView()}
          </main>
        </div>
      ) : (
        /* GIAO DIỆN MOBILE APP: Thiết kế chuẩn smartphone với mục chọn các trang ở phía dưới giao diện */
        <div className="py-6 px-4 flex justify-center items-center min-h-[calc(100vh-45px)] bg-neutral-200/50 dark:bg-black/50">
          <div
            className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all border-4 relative ${
              isDark
                ? 'bg-[#18181b] border-white/30 text-white shadow-black/80'
                : 'bg-white border-neutral-400 text-neutral-900 shadow-neutral-400/40'
            }`}
            style={{ height: '820px' }}
          >
            {/* Mobile Phone Top Notch / Status Bar */}
            <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono border-b border-inherit shrink-0">
              <span className="font-bold">09:41</span>
              <div className="w-20 h-4 bg-black/30 dark:bg-white/20 rounded-full mx-auto" />
              <span>5G · 100%</span>
            </div>

            {/* Mobile Title Bar */}
            <div className="px-5 py-3 border-b border-inherit flex items-center justify-between shrink-0">
              <h2 className="text-sm font-bold tracking-tight">
                {navItems[currentTab].label}
              </h2>
              <button
                onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10"
              >
                {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
              </button>
            </div>

            {/* Mobile Scrollable Viewport */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {renderCurrentView()}
            </div>

            {/* GIAO DIỆN MOBILE APP: MỤC CHỌN CÁC TRANG Ở PHÍA DƯỚI GIAO DIỆN */}
            <div
              className={`p-2 border-t shrink-0 flex items-center justify-around transition-colors ${
                isDark
                  ? 'bg-[#1c1c1f] border-white/20'
                  : 'bg-white border-neutral-300'
              }`}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentTab === item.index;
                return (
                  <button
                    key={item.index}
                    onClick={() => setCurrentTab(item.index)}
                    className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                      active
                        ? isDark
                          ? 'text-white font-bold'
                          : 'text-black font-bold'
                        : isDark
                        ? 'text-neutral-500 hover:text-white'
                        : 'text-neutral-400 hover:text-neutral-900'
                    }`}
                  >
                    <Icon size={18} className={active ? 'scale-110' : ''} />
                    <span className="text-[10px] mt-1 tracking-tight">
                      {item.label.split(' ')[0]}
                    </span>
                    {active && (
                      <span
                        className={`w-1 h-1 rounded-full mt-0.5 ${
                          isDark ? 'bg-white' : 'bg-black'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW API SPECIFICATIONS & FLUTTER STRUCTURE */}
      <ApiSpecModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
