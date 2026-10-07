import 'package:flutter/foundation.dart';
import '../models/task_model.dart';

class TaskController extends ChangeNotifier {
  final List<TaskModel> _tasks = [
    TaskModel(
      id: 'tsk_01',
      title: 'Thiết kế giao diện Flutter Desktop & Mobile',
      category: 'Dự án',
      value: '25000000',
      valueType: TaskValueType.number,
      startTime: DateTime.now().subtract(const Duration(hours: 4)),
      endTime: DateTime.now().add(const Duration(hours: 4)),
      progress: 85,
      notes: 'Hoàn thiện 4 trang chính và xuất API specifications chuẩn',
    ),
    TaskModel(
      id: 'tsk_02',
      title: 'Họp thống nhất kiến trúc Database Server',
      category: 'Họp',
      value: 'Quan trọng',
      valueType: TaskValueType.text,
      startTime: DateTime.now().subtract(const Duration(days: 1, hours: 2)),
      endTime: DateTime.now().subtract(const Duration(days: 1)),
      progress: 100,
      notes: 'Thống nhất chuẩn RESTful API',
    ),
    TaskModel(
      id: 'tsk_03',
      title: 'Nghiên cứu tài liệu State Management Provider',
      category: 'Học tập',
      value: '5',
      valueType: TaskValueType.number,
      startTime: DateTime.now().subtract(const Duration(days: 2)),
      endTime: DateTime.now().subtract(const Duration(days: 2, hours: -3)),
      progress: 100,
      notes: 'Tối ưu hiệu năng rendering cho Desktop & Mobile',
    ),
    TaskModel(
      id: 'tsk_04',
      title: 'Kiểm thử responsive đa độ phân giải màn hình',
      category: 'Dự án',
      value: '10000000',
      valueType: TaskValueType.number,
      startTime: DateTime.now().add(const Duration(days: 1)),
      endTime: DateTime.now().add(const Duration(days: 1, hours: 5)),
      progress: 30,
      notes: 'Test trên macOS, Windows, Linux, Android và iOS',
    ),
  ];

  DateTime _selectedDate = DateTime.now();

  List<TaskModel> get tasks => List.unmodifiable(_tasks);
  DateTime get selectedDate => _selectedDate;

  void setSelectedDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
  }

  List<TaskModel> get tasksForSelectedDate {
    return _tasks.where((t) => isSameDay(t.startTime, _selectedDate)).toList();
  }

  bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  // Mini Calendar Indicator Status:
  // - Có task: true/false
  // - Tất cả hoàn thành (100%): true/false
  bool hasTasksOnDate(DateTime date) {
    return _tasks.any((t) => isSameDay(t.startTime, date));
  }

  bool areAllTasksCompletedOnDate(DateTime date) {
    final dayTasks = _tasks.where((t) => isSameDay(t.startTime, date)).toList();
    if (dayTasks.isEmpty) return false;
    return dayTasks.every((t) => t.isCompleted);
  }

  // CRUD Operations
  void addTask(TaskModel task) {
    _tasks.add(task);
    notifyListeners();
  }

  void updateTask(TaskModel task) {
    final index = _tasks.indexWhere((t) => t.id == task.id);
    if (index != -1) {
      _tasks[index] = task;
      notifyListeners();
    }
  }

  void deleteTask(String id) {
    _tasks.removeWhere((t) => t.id == id);
    notifyListeners();
  }

  void updateProgress(String id, int progress) {
    final index = _tasks.indexWhere((t) => t.id == id);
    if (index != -1) {
      _tasks[index] = _tasks[index].copyWith(progress: progress.clamp(0, 100));
      notifyListeners();
    }
  }

  // Metrics for Home & Statistics
  int get totalTasks => _tasks.length;
  int get completedTasks => _tasks.where((t) => t.isCompleted).length;
  int get uncompletedTasks => _tasks.where((t) => !t.isCompleted).length;

  double get completionRate =>
      _tasks.isEmpty ? 0.0 : (completedTasks / totalTasks) * 100;

  double get totalTaskNumericValue {
    double total = 0.0;
    for (var t in _tasks) {
      if (t.valueType == TaskValueType.number) {
        total += double.tryParse(t.value) ?? 0.0;
      }
    }
    return total;
  }

  // Filter tasks within the last n days
  List<TaskModel> getTasksInPastDays(int days) {
    final cutoff = DateTime.now().subtract(Duration(days: days));
    return _tasks.where((t) => t.startTime.isAfter(cutoff)).toList();
  }
}
