enum MoneyType { income, expense }

class MoneyModel {
  final String id;
  final MoneyType category;
  final String group;
  final String name;
  final int value;
  final String
  date; // [Ngày cụ thể trong tuần]*Số tuần - Ngày bắt đầu - Ngày kết thúc
  final String? notes;

  MoneyModel({
    required this.id,
    required this.name,
    required this.category,
    required this.group,
    required this.value,
    required this.date,
    this.notes,
  });

  DateTime get startTime {
    try {
      return DateTime.parse(
        date.substring(date.indexOf('-'), date.lastIndexOf('-')),
      );
    } catch (_) {
      return DateTime.now();
    }
  }

  DateTime get endTime =>
      DateTime.parse(date.substring(date.lastIndexOf('-') + 1).trim());

  MoneyModel copyWith({
    String? id,
    String? name,
    MoneyType? category,
    String? group,
    int? value,
    String? date,
    String? notes,
  }) {
    return MoneyModel(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      group: group ?? this.group,
      value: value ?? this.value,
      date: date ?? this.date,
      notes: notes ?? this.notes,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'group': group,
      'value': value,
      'date': date,
      'notes': notes,
    };
  }

  factory MoneyModel.fromJson(Map<String, dynamic> json) {
    return MoneyModel(
      id: json['id'] as String,
      name: json['name'] as String,
      category: MoneyType.values.firstWhere(
        (e) => e.toString() == json['category'],
      ),
      group: json['group'] as String,
      value: json['value'] as int,
      date: json['date'] as String,
      notes: json['notes'] as String?,
    );
  }
}
