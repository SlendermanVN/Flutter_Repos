import 'package:flutter/foundation.dart';

enum TaskValueType { number, text }

class TaskModel {
  final String id;
  final String title;
  final String category;
  final String value; // Hỗ trợ cả chữ và số (ví dụ: "25000000" hoặc "Ưu tiên cao")
  final TaskValueType valueType;
  final DateTime startTime;
  final DateTime endTime;
  final int progress; // 0 - 100% (chỉ có mục quản lý công việc mới có)
  final String? notes;

  TaskModel({
    required this.id,
    required this.title,
    required this.category,
    required this.value,
    this.valueType = TaskValueType.number,
    required this.startTime,
    required this.endTime,
    required this.progress,
    this.notes,
  });

  bool get isCompleted => progress >= 100;

  TaskModel copyWith({
    String? id,
    String? title,
    String? category,
    String? value,
    TaskValueType? valueType,
    DateTime? startTime,
    DateTime? endTime,
    int? progress,
    String? notes,
  }) {
    return TaskModel(
      id: id ?? this.id,
      title: title ?? this.title,
      category: category ?? this.category,
      value: value ?? this.value,
      valueType: valueType ?? this.valueType,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      progress: progress ?? this.progress,
      notes: notes ?? this.notes,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'category': category,
      'value': value,
      'value_type': valueType.name,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime.toIso8601String(),
      'progress': progress,
      'notes': notes,
    };
  }

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'] as String,
      title: json['title'] as String,
      category: json['category'] as String,
      value: json['value']?.toString() ?? '',
      valueType: json['value_type'] == 'text' ? TaskValueType.text : TaskValueType.number,
      startTime: DateTime.parse(json['start_time'] as String),
      endTime: DateTime.parse(json['end_time'] as String),
      progress: (json['progress'] as num?)?.toInt() ?? 0,
      notes: json['notes'] as String?,
    );
  }
}
