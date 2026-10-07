import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Wallet, 
  ArrowRight, 
  CalendarDays, 
  Layers, 
  BarChart3, 
  Smartphone, 
  TrendingUp, 
  Sparkles
} from 'lucide-react';
import { Task, Expense } from '../types';

interface HomeTabProps {
  tasks: Task[];
  expenses: Expense[];
  onNavigateToWorks: () => void;
  onNavigateToStats: () => void;
  isDark: boolean;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  tasks,
  expenses,
  onNavigateToWorks,
  onNavigateToStats,
  isDark,
}) => {
  const [pastDays, setPastDays] = useState<number>(7);

  // Filter items in the past n days
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(now.getDate() - pastDays);

  const pastTasks = tasks.filter(t => new Date(t.startTime) >= cutoff);
  const pastExpenses = expenses.filter(e => new Date(e.startTime) >= cutoff);

  const completedTasks = pastTasks.filter(t => t.progress >= 100).length;
  const uncompletedTasks = pastTasks.length - completedTasks;
  const completionRate = pastTasks.length > 0 ? (completedTasks / pastTasks.length) * 100 : 0;

  const totalExpenseAmount = pastExpenses.reduce((acc, curr) => {
    const val = parseFloat(curr.value) || 0;
    return acc + val;
  }, 0);

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const features = [
    {
      icon: <Layers className="w-5 h-5" />,
      title: 'Quản lý Công việc & Sinh hoạt tách biệt',
      desc: 'Nút chuyển đổi trực quan ngay giữa màn hình. Quản lý chi tiết tên, loại, giá trị và mức độ hoàn thành %.',
    },
    {
      icon: <CalendarDays className="w-5 h-5" />,
      title: 'Lịch thu nhỏ chỉ báo màu 3 trạng thái',
      desc: 'Nhận biết tức thì: Chấm đỏ (việc chưa hoàn thành), Chấm xanh lá (việc đã xong) và Chấm vàng gold (sinh hoạt).',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Thống kê đa chu kỳ Tuần / Tháng / Năm',
      desc: 'Bảng dashboard phân tích chuyên sâu chi tiêu sinh hoạt và hiệu suất hoàn thành công việc chi tiết.',
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: 'Chuẩn giao diện Desktop & Mobile App',
      desc: 'Desktop app với sidebar dashboard bên trái; Mobile app với thanh chuyển trang bên dưới tiện dụng.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Hệ thống quản lý năng suất
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Sẵn sàng đồng bộ
            </span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Trang Chủ &amp; Tổng Quan Ứng Dụng
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Theo dõi tiến độ công việc, kiểm soát chi tiêu sinh hoạt trên nền tảng Desktop và Mobile hiện đại.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToWorks}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm'
                : 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-sm'
            }`}
          >
            Vào quản lý ngay
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 1. MỤC LIỆT KÊ TÍNH NĂNG NỔI BẬT HIỆN CÓ CỦA ỨNG DỤNG */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            <Sparkles className="w-4 h-4 text-amber-400" />
            Tính năng nổi bật của ứng dụng
          </h2>
          <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Thiết kế theo chuẩn Flutter Clean Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl transition-all ${
                isDark
                  ? 'bg-[#18181b] border border-white/20 hover:border-white/40'
                  : 'bg-white border border-neutral-300 hover:border-neutral-400 shadow-xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  isDark ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                {feat.icon}
              </div>
              <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {feat.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BẢNG DASHBOARD HIỂN THỊ SỐ LIỆU VỚI N NGÀY GẦN NHẤT */}
      <div
        className={`p-6 rounded-2xl transition-all ${
          isDark
            ? 'bg-[#18181b] border border-white/20'
            : 'bg-white border border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-inherit">
          <div>
            <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Bảng Dashboard Số Liệu
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Tổng hợp hiệu suất công việc và chi tiêu sinh hoạt trong chu kỳ {pastDays} ngày gần nhất
            </p>
          </div>

          {/* Selector n ngày gần nhất */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-inherit bg-neutral-100/50 dark:bg-white/5 self-start sm:self-auto">
            {[7, 14, 30, 60].map((d) => {
              const active = pastDays === d;
              return (
                <button
                  key={d}
                  onClick={() => setPastDays(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? isDark
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'bg-neutral-900 text-white shadow-xs'
                      : isDark
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {d} ngày
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/80 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Tổng số công việc
              </span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {pastTasks.length} <span className="text-xs font-normal text-neutral-400">việc</span>
            </div>
            <div className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {completedTasks} hoàn thành · {uncompletedTasks} đang làm
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/80 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Tỷ lệ hoàn thành
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold tabular-nums text-emerald-500">
              {completionRate.toFixed(1)}%
            </div>
            {/* Progress bar */}
            <div className="w-full bg-neutral-200 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/80 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Chi tiêu sinh hoạt ({pastDays}d)
              </span>
              <Wallet className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold tabular-nums text-amber-500">
              {formatVnd(totalExpenseAmount)}
            </div>
            <div className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {pastExpenses.length} khoản chi phí sinh hoạt
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/80 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Mục sinh hoạt đã ghi
              </span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {pastExpenses.length} <span className="text-xs font-normal text-neutral-400">mục</span>
            </div>
            <div className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Ăn uống, tiền nhà, hóa đơn...
            </div>
          </div>
        </div>

        {/* Recent timeline list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Công việc &amp; sinh hoạt ghi nhận trong chu kỳ
            </h3>
            <button
              onClick={onNavigateToStats}
              className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                isDark ? 'text-white/80 hover:text-white' : 'text-neutral-800 hover:text-black'
              }`}
            >
              Xem báo cáo chi tiết <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {pastTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl flex items-center justify-between border transition-all ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/60 border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      task.progress >= 100 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {task.title}
                    </div>
                    <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Loại: {task.category} · Giá trị: {task.value}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      task.progress >= 100 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {task.progress}%
                  </span>
                </div>
              </div>
            ))}

            {pastExpenses.slice(0, 2).map((exp) => (
              <div
                key={exp.id}
                className={`p-3 rounded-xl flex items-center justify-between border transition-all ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50/60 border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {exp.title}
                    </div>
                    <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Loại: {exp.category} (Sinh hoạt)
                    </div>
                  </div>
                </div>

                <div className="text-xs font-bold text-amber-500 tabular-nums">
                  {formatVnd(parseFloat(exp.value) || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
