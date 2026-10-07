import 'package:flutter/foundation.dart';

enum ExpenseValueType { number, text }

class ExpenseModel {
  final String id;
  final String title;
  final String category;
  final String value; // Hỗ trợ cả chữ và số (ví dụ: "450000" VNĐ hoặc "Vé máy bay")
  final ExpenseValueType valueType;
  final DateTime startTime;
  final DateTime endTime;
  final String? notes;

  ExpenseModel({
    required this.id,
    required this.title,
    required this.category,
    required this.value,
    this.valueType = ExpenseValueType.number,
    required this.startTime,
    required this.endTime,
    this.notes,
  });

  ExpenseModel copyWith({
    String? id,
    String? title,
    String? category,
    String? value,
    ExpenseValueType? valueType,
    DateTime? startTime,
    DateTime? endTime,
    String? notes,
  }) {
    return ExpenseModel(
      id: id ?? this.id,
      title: title ?? this.title,
      category: category ?? this.category,
      value: value ?? this.value,
      valueType: valueType ?? this.valueType,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
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
      'notes': notes,
    };
  }

  factory ExpenseModel.fromJson(Map<String, dynamic> json) {
    return ExpenseModel(
      id: json['id'] as String,
      title: json['title'] as String,
      category: json['category'] as String,
      value: json['value']?.toString() ?? '',
      valueType: json['value_type'] == 'text' ? ExpenseValueType.text : ExpenseValueType.number,
      startTime: DateTime.parse(json['start_time'] as String),
      endTime: DateTime.parse(json['end_time'] as String),
      notes: json['notes'] as String?,
    );
  }
}
