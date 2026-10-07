import React, { useState } from 'react';
import { 
  User, 
  Sun, 
  Moon, 
  Bell, 
  Cloud, 
  Shield, 
  DollarSign, 
  FileText, 
  Check, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ThemeMode } from '../types';

interface SettingsTabProps {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  onOpenApiSpec: () => void;
  isDark: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  themeMode,
  onThemeModeChange,
  onOpenApiSpec,
  isDark,
}) => {
  // User Profile state
  const [fullName, setFullName] = useState('Nguyễn Lê Anh Đức');
  const [email, setEmail] = useState('nguyenleanhduc2004@gmail.com');
  const [currency, setCurrency] = useState('VND (₫)');

  // Feature Settings
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [defaultStatsRange, setDefaultStatsRange] = useState('month');

  // Success indicator message
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Cài Đặt Hệ Thống
        </h1>
        <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Tùy chỉnh giao diện sáng/tối, tài khoản người dùng và thiết lập tính năng đồng bộ.
        </p>
      </div>

      {savedToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check size={16} />
          Đã lưu thành công các cài đặt của bạn!
        </div>
      )}

      {/* 1. CÀI ĐẶT GIAO DIỆN (SÁNG / TỐI) */}
      <div
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-[#18181b] border border-white/20'
            : 'bg-white border border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-inherit">
          <Sun className="w-4 h-4 text-amber-500" />
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            1. Cài Đặt Giao Diện (Chế độ Sáng / Tối)
          </h2>
        </div>

        <p className={`text-xs mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Thiết kế tuân thủ tiêu chuẩn: <strong>Giao diện sáng</strong> mang tông màu trắng chủ đạo, đen xám viền; <strong>Giao diện tối</strong> mang tông màu đen xám chủ đạo, trắng viền.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Mode Box */}
          <button
            onClick={() => onThemeModeChange('light')}
            className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer ${
              themeMode === 'light'
                ? 'border-neutral-950 bg-neutral-50 shadow-xs'
                : 'border-neutral-200 dark:border-white/10 hover:border-neutral-400 bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-neutral-300 flex items-center justify-center text-neutral-900">
                <Sun size={18} />
              </div>
              {themeMode === 'light' && (
                <span className="w-5 h-5 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs">
                  <Check size={12} />
                </span>
              )}
            </div>

            <div className="text-sm font-bold text-neutral-950">Giao diện Sáng (Light Theme)</div>
            <div className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Tông màu trắng chủ đạo (<code className="font-mono text-[11px]">#FFFFFF / #F9FAFB</code>) với viền xám đen (<code className="font-mono text-[11px]">border-neutral-300</code>).
            </div>

            {/* Mini preview bar */}
            <div className="mt-3 p-2 rounded-lg bg-white border border-neutral-300 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-900" />
              <div className="w-16 h-2 rounded-full bg-neutral-200" />
            </div>
          </button>

          {/* Dark Mode Box */}
          <button
            onClick={() => onThemeModeChange('dark')}
            className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer ${
              themeMode === 'dark'
                ? 'border-white bg-white/10 shadow-xs'
                : 'border-neutral-200 dark:border-white/10 hover:border-white/40 bg-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-white/20 flex items-center justify-center text-white">
                <Moon size={18} />
              </div>
              {themeMode === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center text-xs">
                  <Check size={12} />
                </span>
              )}
            </div>

            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Giao diện Tối (Dark Theme)
            </div>
            <div className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Tông màu đen xám chủ đạo (<code className="font-mono text-[11px]">#121212 / #18181B</code>) với viền trắng sáng (<code className="font-mono text-[11px]">border-white/20</code>).
            </div>

            {/* Mini preview bar */}
            <div className="mt-3 p-2 rounded-lg bg-[#121212] border border-white/30 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white" />
              <div className="w-16 h-2 rounded-full bg-white/20" />
            </div>
          </button>
        </div>
      </div>

      {/* 2. CÀI ĐẶT TÀI KHOẢN */}
      <div
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-[#18181b] border border-white/20'
            : 'bg-white border border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-inherit">
          <User className="w-4 h-4 text-blue-500" />
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            2. Cài Đặt Tài Khoản &amp; Cá Nhân
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4 pb-2">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold border ${
                isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-neutral-100 border-neutral-300 text-neutral-900'
              }`}
            >
              {fullName.charAt(0)}
            </div>
            <div>
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {fullName}
              </div>
              <div className="text-xs text-neutral-400">{email}</div>
              <div className="text-[11px] text-emerald-500 mt-0.5">Tài khoản chính (Quản trị viên)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  isDark
                    ? 'bg-neutral-900 border-white/20 focus:border-white'
                    : 'bg-neutral-50 border-neutral-300 focus:border-black'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Email đăng ký</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  isDark
                    ? 'bg-neutral-900 border-white/20 focus:border-white'
                    : 'bg-neutral-50 border-neutral-300 focus:border-black'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Đơn vị tiền tệ hiển thị</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  isDark
                    ? 'bg-neutral-900 border-white/20 focus:border-white'
                    : 'bg-neutral-50 border-neutral-300 focus:border-black'
                }`}
              >
                <option value="VND (₫)">Việt Nam Đồng (VND - ₫)</option>
                <option value="USD ($)">Đô la Mỹ (USD - $)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Mật khẩu</label>
              <input
                type="password"
                defaultValue="••••••••••••"
                disabled
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none opacity-60 ${
                  isDark ? 'bg-neutral-900 border-white/20' : 'bg-neutral-100 border-neutral-300'
                }`}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                  : 'bg-neutral-950 text-white hover:bg-neutral-800'
              }`}
            >
              Lưu thay đổi hồ sơ
            </button>
          </div>
        </form>
      </div>

      {/* 3. CÀI ĐẶT TÍNH NĂNG */}
      <div
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-[#18181b] border border-white/20'
            : 'bg-white border border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-inherit">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            3. Cài Đặt Tính Năng &amp; Hệ Thống
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Thông báo nhắc việc trước hạn
              </div>
              <div className="text-xs text-neutral-400">
                Gửi thông báo đẩy khi công việc sắp đến giờ bắt đầu hoặc kết thúc
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="w-4 h-4 accent-neutral-900 dark:accent-white cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Tự động đồng bộ với Database Server
              </div>
              <div className="text-xs text-neutral-400">
                Đồng bộ hóa dữ liệu thời gian thực qua giao thức RESTful API
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoSyncEnabled}
              onChange={(e) => setAutoSyncEnabled(e.target.checked)}
              className="w-4 h-4 accent-neutral-900 dark:accent-white cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Chu kỳ thống kê mặc định
              </div>
              <div className="text-xs text-neutral-400">
                Chu kỳ hiển thị khi mở trang Thống kê tổng hợp
              </div>
            </div>
            <select
              value={defaultStatsRange}
              onChange={(e) => setDefaultStatsRange(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-xs border outline-none ${
                isDark ? 'bg-neutral-900 border-white/20' : 'bg-neutral-50 border-neutral-300'
              }`}
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. TÀI LIỆU API & MÃ NGUỒN FLUTTER (QUICK VIEW) */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDark
            ? 'bg-white/5 border-white/20'
            : 'bg-neutral-50 border-neutral-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Tài Liệu Đặc Tả API &amp; Mã Nguồn Flutter Dự Án
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              Đã tạo sẵn file <code className="font-mono">api_specifications.txt</code> và toàn bộ thư mục <code className="font-mono">lib/</code> chuẩn Clean Architecture.
            </p>
          </div>

          <button
            onClick={onOpenApiSpec}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              isDark
                ? 'bg-white text-neutral-950 hover:bg-neutral-200'
                : 'bg-neutral-950 text-white hover:bg-neutral-800'
            }`}
          >
            <FileText size={14} />
            Xem tài liệu API &amp; Code
          </button>
        </div>
      </div>
    </div>
  );
};
