import 'package:flutter/foundation.dart';

import '../models/task_model.dart';

class TaskController extends ChangeNotifier {
  final List<TaskModel> _tasks = [
    TaskModel(
      id: 'tsk_01',
      category: 'Cá nhân',
      title: 'Thiết kế giao diện Flutter Desktop & Mobile',
      time: ' - 2026-10-05 09:00 - ',
      subTasksList: [
        SubTaskModel(name: 'Thiết kế database', isCompleted: true),
        SubTaskModel(name: 'Thiết kế giao diện', isCompleted: false),
        SubTaskModel(name: 'Thiết kế logic xử lý', isCompleted: false),
        SubTaskModel(
          name: 'Thiết kế responsive đa độ phân giải',
          isCompleted: false,
          endTime: DateTime.now().add(const Duration(days: 1, hours: 5)),
        ),
      ],
      notes: 'Thiết kế giao diện cho ứng dụng quản lý công việc & chi tiêu',
    ),
    TaskModel(
      id: 'tsk_02',
      category: 'Cá nhân',
      title: 'Mua một con server để triển khai nơi ứng dụng backend',
      time: ' - 2026-10-02 - ',
    ),
    TaskModel(
      id: 'tsk_03',
      category: 'Công việc',
      title: 'Tiếp tục học và làm lab CDN',
      time: ' - 2026-10-01 - ',
    ),
    TaskModel(
      id: 'tsk_04',
      category: 'Công việc',
      title: 'Thuyết trình lần 3',
      time: ' - 2026-10-13 17:00 - 2026-10-13 17:30',
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
    return _tasks
        .where(
          (t) => isSameDay(
            parseDateFromString(t.startTime?.toIso8601String() ?? ''),
            _selectedDate,
          ),
        )
        .toList();
  }

  DateTime parseDateFromString(String dateString) {
    try {
      return DateTime.parse(dateString);
    } catch (e) {
      return DateTime.now();
    }
  }

  bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  // Mini Calendar Indicator Status:
  // - Có task: true/false
  // - Tất cả hoàn thành (100%): true/false
  bool hasTasksOnDate(DateTime date) {
    return _tasks.any(
      (t) => isSameDay(
        parseDateFromString(t.startTime?.toIso8601String() ?? ''),
        date,
      ),
    );
  }

  void updateProgress(String id) {
    final int index = _tasks.indexWhere((item) => item.id == id);
    _tasks[index].isCompleted = (_tasks[index].getProgress == 100);
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

  double getProcessOfTask(String id) {
    final index = _tasks.indexWhere((t) => t.id == id);
    final subTasksListOfIndex = _tasks[index].subTasksList;

    if (index == -1) return -1.0; // Task not found
    final int tasksNumber = subTasksListOfIndex?.length ?? 0;

    if (tasksNumber == 0) return -1.0;
    final int numberOfCompletedSubTasks = subTasksListOfIndex!
        .where((subTask) => subTask.isCompleted)
        .length;

    return numberOfCompletedSubTasks / tasksNumber;
  }

  // Metrics for Home & Statistics
  int get totalTasks => _tasks.length;
  int get completedTasks => _tasks.where((t) => t.isCompleted).length;
  int get uncompletedTasks => _tasks.where((t) => !t.isCompleted).length;

  double get completionRate =>
      _tasks.isEmpty ? 0.0 : (completedTasks / totalTasks) * 100;

  bool areAllTasksCompletedOnDate(DateTime date) {
    final tasksOnDate = _tasks.where(
      (t) => isSameDay(
        parseDateFromString(t.startTime?.toIso8601String() ?? ''),
        date,
      ),
    );

    if (tasksOnDate.isEmpty) return false;

    return tasksOnDate.every((t) => t.isCompleted);
  }

  // Filter tasks within the last n days
  List<TaskModel> getTasksInPastDays(int days) {
    final cutoff = DateTime.now().subtract(Duration(days: days));
    return _tasks
        .where(
          (t) =>
              parseDateFromString((t.startTime?.toIso8601String() ?? ''))
                  .isAfter(cutoff),
        )
        .toList();
  }
}
