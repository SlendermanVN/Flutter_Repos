enum TaskValueType { number, text }

class SubTaskModel {
  final String name;
  DateTime? endTime;
  final bool isCompleted;
  final String? notes;

  SubTaskModel({
    required this.name,
    this.endTime,
    required this.isCompleted,
    this.notes,
  });

  factory SubTaskModel.fromJson(Map<String, dynamic> json) {
    return SubTaskModel(
      name: json['subTaskName'] as String,
      endTime: json['endTime'] != null
          ? DateTime.parse(json['endTime'] as String)
          : null,
      isCompleted: json['isCompleted'] as bool,
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'subTaskName': name,
      'endTime': endTime?.toIso8601String(),
      'isCompleted': isCompleted,
      'notes': notes,
    };
  }
}

class TaskModel {
  final String id;
  final String category;
  final String title;
  String? customer;
  String? time; // Định dạnh thời gian bằng chuỗi như sau:
  // [Ngày cụ thể trong tuần]*Số tuần - Thời gian, ngày bắt đầu - Thời gian, ngày kết thúc
  List<SubTaskModel>?
  subTasksList; // Danh sách các subtask (chỉ có mục quản lý công việc mới có)
  final String? notes;

  TaskModel({
    required this.id,
    required this.category,
    required this.title,
    this.customer,
    required this.time,
    this.subTasksList,
    this.notes,
  });

  String? get name => title;

  DateTime? get startTime {
    if (time == null) return null;
    final startTimeString = time!.split('-')[1].trim();
    return DateTime.tryParse(startTimeString);
  }

  DateTime? get endTime {
    if (time == null) return null;
    final endTimeString = time!.split('-').last.trim();
    return DateTime.tryParse(endTimeString);
  }

  double get getProgress {
    if (subTasksList == null || subTasksList!.isEmpty) {
      return 0.0;
    }
    final completedCount = subTasksList!
        .where((subTask) => subTask.isCompleted)
        .length;
    return (completedCount / subTasksList!.length) * 100;
  }

  bool get isCompleted =>
      subTasksList?.every((subTask) => subTask.isCompleted) ?? false;

  set isCompleted(bool newData) {
    isCompleted = newData;
  }

  TaskModel copyWith({
    String? id,
    String? category,
    String? title,
    String? customer,
    String? time,
    List<SubTaskModel>? subTasksList,
    String? notes,
  }) {
    return TaskModel(
      id: id ?? this.id,
      category: category ?? this.category,
      title: title ?? this.title,
      customer: customer ?? this.customer,
      time: time ?? this.time,
      subTasksList: subTasksList ?? this.subTasksList,
      notes: notes ?? this.notes,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category': category,
      'title': title,
      'customer': customer,
      'time': time,
      'subTasksList': subTasksList?.map((subTask) => subTask.toJson()).toList(),
      'notes': notes,
    };
  }

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'] as String,
      category: json['category'] as String,
      title: json['title'] as String,
      customer: json['customer'] as String?,
      time: json['time'] as String?,
      subTasksList: (json['subTasksList'] as List<dynamic>?)
          ?.map((e) => SubTaskModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      notes: json['notes'] as String?,
    );
  }
}
