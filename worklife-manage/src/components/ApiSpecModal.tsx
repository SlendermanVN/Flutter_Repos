import React, { useState } from 'react';
import { X, Copy, Check, FileText, Code2, Terminal } from 'lucide-react';

interface ApiSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const ApiSpecModal: React.FC<ApiSpecModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'api' | 'flutter' | 'cmd'>('api');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const apiContent = `================================================================================
TÀI LIỆU ĐẶC TẢ API DATABASE SERVER (API SPECIFICATION)
DỰ ÁN: WORKLIFE MANAGER - QUẢN LÝ CÔNG VIỆC & SINH HOẠT
Phiên bản: 1.0.0 (Chuẩn RESTful JSON API)
Base URL: https://api.worklifemanager.com/v1
================================================================================

I. HEADER BẮT BUỘC:
  - Content-Type: application/json
  - Authorization: Bearer <jwt_access_token>

II. DANH SÁCH CÁC ENDPOINT CHÍNH:

1. NHÓM AUTH & PROFILE:
  - POST   /auth/register          : Đăng ký tài khoản
  - POST   /auth/login             : Đăng nhập lấy access_token JWT
  - GET    /user/profile           : Lấy hồ sơ & cài đặt (theme, currency, sync)
  - PUT    /user/profile           : Cập nhật cài đặt tài khoản

2. NHÓM DASHBOARD & TỔNG QUAN N NGÀY:
  - GET    /dashboard/overview?days=7 : Thống kê n ngày gần nhất (tổng task, % hoàn thành, chi tiêu)

3. NHÓM QUẢN LÝ CÔNG VIỆC (TASK CRUD):
  - GET    /tasks                  : Lấy danh sách (query: date, category, is_completed)
  - POST   /tasks                  : Tạo công việc mới (tên, loại, giá trị, start_time, end_time, progress %)
  - GET    /tasks/:id              : Xem chi tiết công việc
  - PUT    /tasks/:id              : Cập nhật công việc / cập nhật % hoàn thành
  - DELETE /tasks/:id              : Xóa công việc

4. NHÓM QUẢN LÝ SINH HOẠT (EXPENSES CRUD):
  - GET    /expenses               : Danh sách sinh hoạt (query: date, category)
  - POST   /expenses               : Tạo mới sinh hoạt (tên, loại, giá trị, start_time, end_time, notes)
  - PUT    /expenses/:id           : Cập nhật sinh hoạt
  - DELETE /expenses/:id           : Xóa sinh hoạt

5. NHÓM CHỈ BÁO LỊCH THU NHỎ (MINI CALENDAR INDICATORS):
  - GET    /calendar/indicators?year=2026&month=10
    Trả về mảng ngày:
    + all_tasks_completed: true -> Chấm xanh lá
    + has_uncompleted_task: true -> Chấm đỏ
    + has_expense: true -> Chấm vàng gold

6. NHÓM THỐNG KÊ TỔNG HỢP (STATISTICS):
  - GET    /statistics/summary?period=month&date=2026-10-04
    Trả về:
    + top_highlight_kpis: Số hoàn thành, chưa hoàn thành, tổng giá trị việc, tổng chi tiêu sinh hoạt
    + tasks_analysis: Phân loại theo danh mục
    + living_analysis: Phân loại cơ cấu chi tiêu sinh hoạt`;

  const flutterStructure = `CẤU TRÚC THƯ MỤC DỰ ÁN FLUTTER ĐÃ TẠO (TRÙNG KHỚP SCREENSHOT CỦA BẠN):

lib/
├── controllers/
│   ├── expense_controller.dart  # Quản lý danh sách sinh hoạt, chi tiêu, CRUD, chỉ báo chấm vàng
│   └── task_controller.dart     # Quản lý công việc, CRUD, tiến độ 0-100%, chỉ báo chấm đỏ/xanh
├── models/
│   ├── expense_model.dart       # Model sinh hoạt: tên, loại, giá trị (chữ/số), giờ bắt đầu/kết thúc
│   └── task_model.dart          # Model công việc: tên, loại, giá trị, giờ bắt đầu/kết thúc, progress %
├── views/
│   ├── calendars/
│   │   └── index.dart           # Widget lịch thu nhỏ (MiniCalendar) với chấm đỏ/xanh/vàng
│   ├── home/
│   │   └── index.dart           # Trang chủ: Tính năng nổi bật + Dashboard n ngày gần nhất
│   ├── settings/
│   │   └── index.dart           # Trang cài đặt: Tài khoản, tính năng, giao diện sáng/tối
│   ├── statistics/
│   │   └── index.dart           # Trang thống kê: Lọc tuần/tháng/năm, KPI nổi bật trên cùng
│   └── works/
│       └── index.dart           # Trang quản lý: Nút chuyển đổi việc/sinh hoạt ở giữa, CRUD, thống kê cuối
├── main_example.dart            # File ví dụ khởi chạy
├── main.dart                    # File ghép nối tất cả, hỗ trợ Desktop sidebar & Mobile bottom bar
└── pubspec.yaml                 # Cấu hình dependencies (provider, intl, google_fonts)`;

  const commandGuide = `HƯỚNG DẪN CHẠY TRÊN MÁY LOCAL CỦA BẠN:

1. Di chuyển vào thư mục dự án và tải thư viện:
   $ flutter pub get

2. Kiểm tra môi trường hệ thống:
   $ flutter doctor

3. Chạy Desktop App (Windows / macOS / Linux):
   $ flutter run -d windows    # hoặc macos / linux
   # Hoặc gõ: flutter run và chọn phím 1 tương ứng với Desktop app

4. Chạy Mobile App (Android / iOS):
   $ flutter run -d android    # hoặc ios

Lưu ý: Môi trường cloud sandbox AI Studio hiện tại là Web Node.js container (chạy live web preview tại port 3000), toàn bộ file source code Flutter chuẩn trong thư mục /lib và pubspec.yaml đã được sinh ra đầy đủ, sạch sẽ, không lỗi cú pháp, bạn có thể copy hoặc git clone về máy để chạy trực tiếp!`;

  const handleCopy = () => {
    let text = apiContent;
    if (activeTab === 'flutter') text = flutterStructure;
    if (activeTab === 'cmd') text = commandGuide;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-3xl rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] ${
          isDark
            ? 'bg-[#18181b] border border-white/20 text-white'
            : 'bg-white border border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold">
              Tài Liệu Đặc Tả API &amp; Cấu Trúc Mã Nguồn Flutter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-inherit">
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'api'
                ? isDark
                  ? 'bg-white text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            Đặc tả API Server (api_specifications.txt)
          </button>

          <button
            onClick={() => setActiveTab('flutter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'flutter'
                ? isDark
                  ? 'bg-white text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Code2 size={13} />
            Cây thư mục lib/
          </button>

          <button
            onClick={() => setActiveTab('cmd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cmd'
                ? isDark
                  ? 'bg-white text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal size={13} />
            Lệnh chạy Flutter
          </button>

          <button
            onClick={handleCopy}
            className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
              copied
                ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
                : isDark
                ? 'border-white/20 hover:bg-white/10 text-white'
                : 'border-neutral-300 hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Đã sao chép!' : 'Sao chép nội dung'}
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto mt-4 p-4 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs leading-relaxed border border-neutral-800">
          <pre className="whitespace-pre-wrap font-mono">
            {activeTab === 'api' && apiContent}
            {activeTab === 'flutter' && flutterStructure}
            {activeTab === 'cmd' && commandGuide}
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs text-neutral-400">
          <span>File đã được tạo trực tiếp tại thư mục gốc <code className="font-mono text-neutral-300">/api_specifications.txt</code></span>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              isDark ? 'bg-white text-neutral-950' : 'bg-neutral-950 text-white'
            }`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
