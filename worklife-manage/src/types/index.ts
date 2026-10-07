export type ValueType = 'number' | 'text';

export interface Task {
  id: string;
  title: string;
  category: string;
  value: string; // Chữ hoặc số (ví dụ: "25000000" VNĐ hoặc "Mức độ ưu tiên cao")
  valueType: ValueType;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  progress: number;  // 0 - 100% (chỉ có ở công việc)
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  value: string; // Chữ hoặc số (ví dụ: "450000" VNĐ)
  valueType: ValueType;
  startTime: string;
  endTime: string;
  notes?: string;
}

export type ThemeMode = 'light' | 'dark';
export type DeviceView = 'desktop' | 'mobile';
export type TimePeriod = 'week' | 'month' | 'year';
