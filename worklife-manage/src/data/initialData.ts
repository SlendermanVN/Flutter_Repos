import { Task, Expense } from '../types';

const now = new Date();
const todayStr = now.toISOString().split('T')[0];

const formatIso = (dayOffset: number, hour: number, minute: number) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const initialTasks: Task[] = [
  {
    id: 'tsk_01',
    title: 'Phát triển Frontend Flutter Desktop & Mobile',
    category: 'Dự án',
    value: '25000000',
    valueType: 'number',
    startTime: formatIso(0, 8, 30),
    endTime: formatIso(0, 17, 30),
    progress: 85, // Chưa hoàn thành (<100%) -> Red dot for today!
    notes: 'Ghép nối index.dart, xây dựng 4 trang theo yêu cầu',
  },
  {
    id: 'tsk_02',
    title: 'Họp review tiến độ công việc với đối tác',
    category: 'Họp',
    value: 'Cấp A',
    valueType: 'text',
    startTime: formatIso(-1, 9, 0),
    endTime: formatIso(-1, 10, 30),
    progress: 100, // Hoàn thành 100%
    notes: 'Đã thống nhất thông số API specifications',
  },
  {
    id: 'tsk_03',
    title: 'Nghiên cứu tài liệu State Management Provider & Clean Architecture',
    category: 'Học tập',
    value: '10',
    valueType: 'number',
    startTime: formatIso(-1, 14, 0),
    endTime: formatIso(-1, 16, 0),
    progress: 100, // Ngày -1 tất cả việc đều 100% -> Green dot!
    notes: 'Áp dụng cho cấu trúc controllers và models',
  },
  {
    id: 'tsk_04',
    title: 'Kiểm thử UI responsive đa nền tảng và Theme Switcher',
    category: 'Dự án',
    value: '15000000',
    valueType: 'number',
    startTime: formatIso(2, 9, 0),
    endTime: formatIso(2, 12, 0),
    progress: 25, // Chưa xong -> Red dot
    notes: 'Kiểm tra tỷ lệ hiển thị trên màn hình Desktop và Mobile',
  },
  {
    id: 'tsk_05',
    title: 'Viết tài liệu đặc tả API Server Database (RESTful standard)',
    category: 'Dự án',
    value: 'Quan trọng',
    valueType: 'text',
    startTime: formatIso(-3, 10, 0),
    endTime: formatIso(-3, 15, 0),
    progress: 100, // Hoàn thành -> Green dot
    notes: 'Hoàn thiện file api_specifications.txt',
  },
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp_01',
    title: 'Mua thực phẩm tươi sống siêu thị WinMart',
    category: 'Ăn uống',
    value: '450000',
    valueType: 'number',
    startTime: formatIso(0, 18, 0),
    endTime: formatIso(0, 19, 0),
    notes: 'Thực phẩm dinh dưỡng cho cả tuần',
  },
  {
    id: 'exp_02',
    title: 'Thanh toán tiền điện & nước sinh hoạt',
    category: 'Hóa đơn',
    value: '1250000',
    valueType: 'number',
    startTime: formatIso(-1, 8, 30),
    endTime: formatIso(-1, 8, 45),
    notes: 'Chuyển khoản qua ngân hàng điện tử',
  },
  {
    id: 'exp_03',
    title: 'Đổ xăng ô tô & rửa xe cuối tuần',
    category: 'Di chuyển',
    value: '680000',
    valueType: 'number',
    startTime: formatIso(-2, 16, 0),
    endTime: formatIso(-2, 17, 0),
    notes: 'Cây xăng Petrolimex',
  },
  {
    id: 'exp_04',
    title: 'Tiền thuê căn hộ chung cư tháng 10',
    category: 'Tiền nhà',
    value: '5500000',
    valueType: 'number',
    startTime: formatIso(-3, 9, 0),
    endTime: formatIso(-3, 9, 15),
    notes: 'Tiền phòng đã gồm phí quản lý',
  },
  {
    id: 'exp_05',
    title: 'Mua sách chuyên ngành Flutter & Clean Code',
    category: 'Mua sắm',
    value: '380000',
    valueType: 'number',
    startTime: formatIso(1, 14, 0),
    endTime: formatIso(1, 15, 0),
    notes: 'Đặt mua trên Tiki Fahasa',
  },
];
