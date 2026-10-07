import 'package:flutter/foundation.dart';
import '../models/expense_model.dart';

class ExpenseController extends ChangeNotifier {
  final List<ExpenseModel> _expenses = [
    ExpenseModel(
      id: 'exp_01',
      title: 'Mua thực phẩm & siêu thị rau củ tuần',
      category: 'Ăn uống',
      value: '450000',
      valueType: ExpenseValueType.number,
      startTime: DateTime.now().subtract(const Duration(hours: 3)),
      endTime: DateTime.now().subtract(const Duration(hours: 2)),
      notes: 'Siêu thị WinMart',
    ),
    ExpenseModel(
      id: 'exp_02',
      title: 'Thanh toán tiền điện nước căn hộ',
      category: 'Hóa đơn',
      value: '1250000',
      valueType: ExpenseValueType.number,
      startTime: DateTime.now().subtract(const Duration(days: 1)),
      endTime: DateTime.now().subtract(const Duration(days: 1, hours: -1)),
      notes: 'Thanh toán qua ví điện tử',
    ),
    ExpenseModel(
      id: 'exp_03',
      title: 'Đổ xăng xe máy & bảo dưỡng định kỳ',
      category: 'Di chuyển',
      value: '280000',
      valueType: ExpenseValueType.number,
      startTime: DateTime.now().subtract(const Duration(days: 2)),
      endTime: DateTime.now().subtract(const Duration(days: 2, hours: -1)),
      notes: 'Thay dầu nhớt máy',
    ),
    ExpenseModel(
      id: 'exp_04',
      title: 'Tiền thuê căn hộ tháng 10',
      category: 'Tiền nhà',
      value: '5500000',
      valueType: ExpenseValueType.number,
      startTime: DateTime.now().subtract(const Duration(days: 3)),
      endTime: DateTime.now().subtract(const Duration(days: 3, hours: -1)),
      notes: 'Đã chuyển khoản chủ nhà',
    ),
  ];

  DateTime _selectedDate = DateTime.now();

  List<ExpenseModel> get expenses => List.unmodifiable(_expenses);
  DateTime get selectedDate => _selectedDate;

  void setSelectedDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
  }

  bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  List<ExpenseModel> get expensesForSelectedDate {
    return _expenses.where((e) => isSameDay(e.startTime, _selectedDate)).toList();
  }

  // Mini Calendar Indicator Status:
  // - Ngày có sinh hoạt: true/false (Hiển thị chấm màu vàng gold)
  bool hasExpenseOnDate(DateTime date) {
    return _expenses.any((e) => isSameDay(e.startTime, date));
  }

  // CRUD Operations
  void addExpense(ExpenseModel expense) {
    _expenses.add(expense);
    notifyListeners();
  }

  void updateExpense(ExpenseModel expense) {
    final index = _expenses.indexWhere((e) => e.id == expense.id);
    if (index != -1) {
      _expenses[index] = expense;
      notifyListeners();
    }
  }

  void deleteExpense(String id) {
    _expenses.removeWhere((e) => e.id == id);
    notifyListeners();
  }

  // Metrics
  int get totalExpensesCount => _expenses.length;

  double get totalExpenseAmount {
    double total = 0.0;
    for (var e in _expenses) {
      if (e.valueType == ExpenseValueType.number) {
        total += double.tryParse(e.value) ?? 0.0;
      }
    }
    return total;
  }

  // Filter expenses within past n days
  List<ExpenseModel> getExpensesInPastDays(int days) {
    final cutoff = DateTime.now().subtract(Duration(days: days));
    return _expenses.where((e) => e.startTime.isAfter(cutoff)).toList();
  }
}
