import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  Briefcase, 
  TrendingUp, 
  PieChart, 
  Download, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Task, Expense, TimePeriod } from '../types';

interface StatisticsTabProps {
  tasks: Task[];
  expenses: Expense[];
  isDark: boolean;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({
  tasks,
  expenses,
  isDark,
}) => {
  const [period, setPeriod] = useState<TimePeriod>('month');

  // Aggregation calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.progress >= 100).length;
  const uncompletedTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Task numeric value sum
  const totalTaskValue = tasks.reduce((sum, t) => {
    const val = parseFloat(t.value);
    return !isNaN(val) ? sum + val : sum;
  }, 0);

  // Living expenses sum
  const totalExpenses = expenses.reduce((sum, e) => {
    const val = parseFloat(e.value);
    return !isNaN(val) ? sum + val : sum;
  }, 0);

  const formatVnd = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';

  // Group tasks by category
  const taskCategories = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group expenses by category
  const expenseCategories = expenses.reduce((acc, e) => {
    const val = parseFloat(e.value) || 0;
    acc[e.category] = (acc[e.category] || 0) + val;
    return acc;
  }, {} as Record<string, number>);

  const handleExportData = () => {
    const data = {
      period,
      export_date: new Date().toISOString(),
      summary: {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        uncompleted_tasks: uncompletedTasks,
        completion_rate: completionRate,
        total_task_value: totalTaskValue,
        total_living_expenses: totalExpenses,
      },
      tasks,
      expenses,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worklife_report_${period}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Period Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Tổng Hợp &amp; Thống Kê Báo Cáo
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Phân tích số liệu độc lập cho cả công việc và chi tiêu sinh hoạt theo từng chu kỳ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector: Tuần / Tháng / Năm */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-inherit bg-neutral-100/50 dark:bg-white/5">
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                period === 'week'
                  ? isDark
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-950 text-white shadow-xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                period === 'month'
                  ? isDark
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-950 text-white shadow-xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tháng này
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                period === 'year'
                  ? isDark
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-950 text-white shadow-xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Năm nay
            </button>
          </div>

          <button
            onClick={handleExportData}
            className={`p-2 rounded-xl border border-inherit transition-all cursor-pointer ${
              isDark
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-neutral-100 text-neutral-800'
            }`}
            title="Xuất dữ liệu báo cáo JSON"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* 1. MỤC NỔI BẬT TRÊN CÙNG: SỐ LƯỢNG HOÀN THÀNH / CHƯA HOÀN THÀNH, TỔNG CHI TIÊU CÔNG VIỆC VÀ CẢ SINH HOẠT */}
      <div
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-[#18181b] border-2 border-white/20'
            : 'bg-white border-2 border-neutral-300 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              CHỈ SỐ TỔNG HỢP NỔI BẬT ({period.toUpperCase()})
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Dữ liệu tổng hợp trực tiếp
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Công việc hoàn thành */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-emerald-50/50 border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Công việc hoàn thành
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {completedTasks} <span className="text-xs font-normal opacity-80">công việc</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Đạt 100% mức độ hoàn thành
            </div>
          </div>

          {/* Card 2: Công việc chưa hoàn thành */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-red-50/50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                Công việc chưa hoàn thành
              </span>
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">
              {uncompletedTasks} <span className="text-xs font-normal opacity-80">công việc</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Cần ưu tiên xử lý hoàn tất
            </div>
          </div>

          {/* Card 3: Tổng chi tiêu công việc */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Tổng giá trị công việc
              </span>
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <div className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {formatVnd(totalTaskValue)}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Quy mô dự án &amp; chi phí công việc
            </div>
          </div>

          {/* Card 4: Tổng chi tiêu sinh hoạt */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-amber-50/40 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Tổng chi tiêu sinh hoạt
              </span>
              <Wallet className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {formatVnd(totalExpenses)}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Ăn uống, thuê nhà, hóa đơn, v.v.
            </div>
          </div>
        </div>
      </div>

      {/* 2. TỪNG MỤC CÔNG VIỆC VÀ SINH HOẠT RIÊNG BIỆT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PHẦN CÔNG VIỆC RIÊNG */}
        <div
          className={`p-6 rounded-2xl ${
            isDark
              ? 'bg-[#18181b] border border-white/20'
              : 'bg-white border border-neutral-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Mục Công Việc: Phân tích &amp; Cơ cấu
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-blue-500">
              {totalTasks} nhiệm vụ
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                  Tỷ lệ hoàn thành tổng thể:
                </span>
                <span className="text-emerald-500 font-mono font-bold">{completionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Phân loại theo danh mục công việc:
              </h3>
              <div className="space-y-2.5">
                {Object.entries(taskCategories).map(([cat, count]) => {
                  const pct = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{cat}</span>
                        <span className={`font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {count} việc ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List top tasks */}
            <div className="pt-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Chi tiết tiến độ từng công việc:
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tasks.map(t => (
                  <div
                    key={t.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {t.title}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {t.category} · Giá trị: {t.value}
                      </div>
                    </div>
                    <span
                      className={`font-mono font-bold shrink-0 ${
                        t.progress >= 100 ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {t.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN SINH HOẠT RIÊNG */}
        <div
          className={`p-6 rounded-2xl ${
            isDark
              ? 'bg-[#18181b] border border-white/20'
              : 'bg-white border border-neutral-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-500" />
              <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Mục Sinh Hoạt: Cơ cấu chi tiêu &amp; Phân bổ
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-amber-500">
              {formatVnd(totalExpenses)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Cơ cấu các nhóm chi tiêu sinh hoạt:
              </h3>
              <div className="space-y-3">
                {Object.entries(expenseCategories).map(([cat, amt]) => {
                  const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{cat}</span>
                        <span className="font-mono text-amber-500 font-bold">
                          {formatVnd(amt)} ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List items */}
            <div className="pt-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Các khoản chi tiêu sinh hoạt gần nhất:
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {expenses.map(e => (
                  <div
                    key={e.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {e.title}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {e.category} · {new Date(e.startTime).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-500 shrink-0">
                      {!isNaN(Number(e.value)) ? formatVnd(Number(e.value)) : e.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
