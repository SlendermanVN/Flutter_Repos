import 'package:flutter/foundation.dart';

import '../models/money_model.dart';

class MoneyController extends ChangeNotifier {
  final List<MoneyModel> _money = [
    MoneyModel(
      id: 'exp_01',
      category: MoneyType.expense,
      group: 'Chi phí công việc',
      name: 'Ăn trưa tại công ty',
      value: 30000,
      date: DateTime.now().toString(),
      notes: 'Ăn trưa tại quán cơm',
    ),
    MoneyModel(
      id: 'exp_02',
      category: MoneyType.expense,
      group: 'Chi phí công việc',
      name: 'Thanh toán tiền trọ tháng 10',
      value: 1500000,
      date: DateTime.now().subtract(const Duration(days: 1)).toString(),
      notes: 'Thanh toán qua ví điện tử',
    ),
    MoneyModel(
      id: 'exp_03',
      category: MoneyType.expense,
      group: 'Chi phí sinh hoạt',
      name: 'Tiền đổ xăng',
      value: 300000,
      date: DateTime.now().subtract(const Duration(days: 2)).toString(),
      notes: 'Chi phí hàng tháng (2 tuần đổ xăng 1 lần)',
    ),
    MoneyModel(
      id: 'exp_04',
      name: 'Tiền lương',
      category: MoneyType.income,
      group: "Chi phí sinh hoạt",
      value: 3000000,
      date: DateTime.now().subtract(const Duration(days: 3)).toString(),
      notes: 'Lương tháng 9',
    ),
  ];

  DateTime _selectedDate = DateTime.now();

  List<MoneyModel> get moneys => List.unmodifiable(_money);
  DateTime get selectedDate => _selectedDate;

  void setSelectedDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
  }

  bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  List<MoneyModel> get expensesForSelectedDate {
    return _money.where((e) => isSameDay(e.startTime, _selectedDate)).toList();
  }

  // Mini Calendar Indicator Status:
  // - Ngày có nhận/chi tiêu: true/false (Hiển thị chấm màu vàng gold)
  bool hasMoneyOnDate(DateTime date) {
    return _money.any((e) => isSameDay(e.startTime, date));
  }

  // CRUD Operations
  void addMoney(MoneyModel expense) {
    _money.add(expense);
    notifyListeners();
  }

  void updateMoney(MoneyModel expense) {
    final index = _money.indexWhere((e) => e.id == expense.id);
    if (index != -1) {
      _money[index] = expense;
      notifyListeners();
    }
  }

  void deleteMoney(String id) {
    _money.removeWhere((e) => e.id == id);
    notifyListeners();
  }

  // Metrics
  int get totalExpensesCount =>
      _money.where((e) => e.category == MoneyType.expense).length;

  int get totalIncomeCount =>
      _money.where((e) => e.category == MoneyType.income).length;

  int get totalMoney {
    int total = 0;
    for (MoneyModel item in _money) {
      if (item.category == MoneyType.expense) {
        total -= item.value;
      } else {
        total += item.value;
      }
    }
    return total;
  }

  // Filter expenses within past n days
  List<MoneyModel> getMoneyInPastDays(int days) {
    final cutoff = DateTime.now().subtract(Duration(days: days));
    return _money.where((e) => e.startTime.isAfter(cutoff)).toList();
  }

  List<MoneyModel> get moneysForSelectedDate {
    return _money
        .where(
          (item) =>
              (item.startTime == _selectedDate ||
                  _selectedDate.isAfter(item.startTime)) &&
              (item.endTime == _selectedDate ||
                  _selectedDate.isBefore(item.endTime)),
        )
        .toList();
  }
}
