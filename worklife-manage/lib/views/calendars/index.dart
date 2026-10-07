import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../controllers/task_controller.dart';
import '../../controllers/expense_controller.dart';

class MiniCalendarWidget extends StatefulWidget {
  final Function(DateTime)? onDateSelected;

  const MiniCalendarWidget({super.key, this.onDateSelected});

  @override
  State<MiniCalendarWidget> createState() => _MiniCalendarWidgetState();
}

class _MiniCalendarWidgetState extends State<MiniCalendarWidget> {
  DateTime _currentMonth = DateTime.now();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final taskCtrl = context.watch<TaskController>();
    final expCtrl = context.watch<ExpenseController>();

    final firstDayOfMonth = DateTime(_currentMonth.year, _currentMonth.month, 1);
    final lastDayOfMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 0);
    final daysInMonth = lastDayOfMonth.day;
    final startingWeekday = firstDayOfMonth.weekday; // 1 = Mon, 7 = Sun

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.15) : const Color(0xFFE5E7EB),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Month/Year navigation
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                DateFormat('MMMM yyyy', 'vi').format(_currentMonth).toUpperCase(),
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                  color: isDark ? Colors.white : const Color(0xFF111827),
                ),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.chevron_left, size: 20),
                    visualDensity: VisualDensity.compact,
                    onPressed: () {
                      setState(() {
                        _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1);
                      });
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.chevron_right, size: 20),
                    visualDensity: VisualDensity.compact,
                    onPressed: () {
                      setState(() {
                        _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1);
                      });
                    },
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Legend for indicators
          Wrap(
            spacing: 12,
            runSpacing: 6,
            children: [
              _buildLegendItem(
                color: const Color(0xFFEF4444),
                label: 'Việc chưa xong',
                isDark: isDark,
              ),
              _buildLegendItem(
                color: const Color(0xFF10B981),
                label: 'Việc đã hoàn thành',
                isDark: isDark,
              ),
              _buildLegendItem(
                color: const Color(0xFFEAB308), // Gold
                label: 'Có sinh hoạt',
                isDark: isDark,
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Weekday row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) {
              return SizedBox(
                width: 32,
                child: Text(
                  d,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 8),

          // Days Grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 42, // 6 rows * 7 cols
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              crossAxisSpacing: 4,
              mainAxisSpacing: 6,
              childAspectRatio: 1.0,
            ),
            itemBuilder: (context, index) {
              final dayOffset = index - (startingWeekday - 1);
              if (dayOffset < 0 || dayOffset >= daysInMonth) {
                return const SizedBox.shrink();
              }

              final day = dayOffset + 1;
              final date = DateTime(_currentMonth.year, _currentMonth.month, day);
              final isSelected = taskCtrl.isSameDay(date, taskCtrl.selectedDate);
              final isToday = taskCtrl.isSameDay(date, DateTime.now());

              final hasTasks = taskCtrl.hasTasksOnDate(date);
              final allCompleted = taskCtrl.areAllTasksCompletedOnDate(date);
              final hasExpense = expCtrl.hasExpenseOnDate(date);

              return InkWell(
                onTap: () {
                  taskCtrl.setSelectedDate(date);
                  expCtrl.setSelectedDate(date);
                  widget.onDateSelected?.call(date);
                },
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected
                        ? (isDark ? Colors.white : Colors.black)
                        : (isToday
                            ? (isDark ? Colors.white12 : Colors.grey.shade100)
                            : Colors.transparent),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isSelected
                          ? (isDark ? Colors.white : Colors.black)
                          : (isToday
                              ? (isDark ? Colors.white30 : Colors.black26)
                              : Colors.transparent),
                      width: 1,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '$day',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          color: isSelected
                              ? (isDark ? Colors.black : Colors.white)
                              : (isDark ? Colors.white : Colors.black87),
                        ),
                      ),
                      const SizedBox(height: 2),
                      // Indicator Dots
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (hasTasks)
                            Container(
                              width: 5,
                              height: 5,
                              margin: const EdgeInsets.symmetric(horizontal: 1),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: allCompleted
                                    ? const Color(0xFF10B981) // Green
                                    : const Color(0xFFEF4444), // Red
                              ),
                            ),
                          if (hasExpense)
                            Container(
                              width: 5,
                              height: 5,
                              margin: const EdgeInsets.symmetric(horizontal: 1),
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: Color(0xFFEAB308), // Gold
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem({required Color color, required String label, required bool isDark}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: isDark ? Colors.white70 : const Color(0xFF4B5563),
          ),
        ),
      ],
    );
  }
}
