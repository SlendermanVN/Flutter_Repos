import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../controllers/task_controller.dart';
import '../../controllers/expense_controller.dart';
import '../../models/task_model.dart';
import '../../models/expense_model.dart';

class StatisticsView extends StatefulWidget {
  const StatisticsView({super.key});

  @override
  State<StatisticsView> createState() => _StatisticsViewState();
}

class _StatisticsViewState extends State<StatisticsView> {
  // Period filter: 'week', 'month', 'year'
  String _selectedPeriod = 'month';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final taskCtrl = context.watch<TaskController>();
    final expCtrl = context.watch<ExpenseController>();

    final currencyFmt = NumberFormat('#,###', 'vi_VN');

    // Aggregate statistics
    final totalTasks = taskCtrl.totalTasks;
    final completedTasks = taskCtrl.completedTasks;
    final uncompletedTasks = taskCtrl.uncompletedTasks;
    final completionRate = taskCtrl.completionRate;
    final totalTaskValue = taskCtrl.totalTaskNumericValue;
    final totalExpenses = expCtrl.totalExpenseAmount;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with Period Filter (Tuần / Tháng / Năm)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tổng hợp dữ liệu Công việc & Sinh hoạt',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : const Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Báo cáo và phân tích chuyên sâu đa chu kỳ',
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
              // Filter selector
              Container(
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
                  ),
                ),
                padding: const EdgeInsets.all(4),
                child: Row(
                  children: [
                    _buildPeriodBtn('Tuần', 'week', isDark),
                    _buildPeriodBtn('Tháng', 'month', isDark),
                    _buildPeriodBtn('Năm', 'year', isDark),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // 1. Mục số lượng công việc hoàn thành/chưa hoàn thành, tổng chi tiêu công việc và cả sinh hoạt hiển thị nổi bật ngay trên cùng
          _buildTopHighlightKpis(
            completedTasks: completedTasks,
            uncompletedTasks: uncompletedTasks,
            totalTasks: totalTasks,
            completionRate: completionRate,
            totalTaskValue: totalTaskValue,
            totalExpenses: totalExpenses,
            currencyFmt: currencyFmt,
            isDark: isDark,
          ),

          const SizedBox(height: 32),

          // 2. Từng mục công việc và sinh hoạt riêng biệt
          LayoutBuilder(
            builder: (context, constraints) {
              final isDesktop = constraints.maxWidth > 900;
              if (isDesktop) {
                return Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: _buildTasksAnalysisSection(taskCtrl.tasks, isDark, currencyFmt),
                    ),
                    const SizedBox(width: 24),
                    Expanded(
                      child: _buildLivingAnalysisSection(expCtrl.expenses, isDark, currencyFmt),
                    ),
                  ],
                );
              } else {
                return Column(
                  children: [
                    _buildTasksAnalysisSection(taskCtrl.tasks, isDark, currencyFmt),
                    const SizedBox(height: 24),
                    _buildLivingAnalysisSection(expCtrl.expenses, isDark, currencyFmt),
                  ],
                );
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodBtn(String label, String code, bool isDark) {
    final active = _selectedPeriod == code;
    return InkWell(
      onTap: () => setState(() => _selectedPeriod = code),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: active ? (isDark ? Colors.white : Colors.black) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: active ? (isDark ? Colors.black : Colors.white) : (isDark ? Colors.white70 : Colors.black87),
          ),
        ),
      ),
    );
  }

  // Mục nổi bật trên cùng
  Widget _buildTopHighlightKpis({
    required int completedTasks,
    required int uncompletedTasks,
    required int totalTasks,
    required double completionRate,
    required double totalTaskValue,
    required double totalExpenses,
    required NumberFormat currencyFmt,
    required bool isDark,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isDark ? Colors.white24 : const Color(0xFFE5E7EB),
          width: 1.2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'CHỈ SỐ TỔNG HỢP NỔI BẬT (${_selectedPeriod.toUpperCase()})',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                  color: isDark ? Colors.white70 : const Color(0xFF4B5563),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isDark ? Colors.white12 : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'Cập nhật thời gian thực',
                  style: TextStyle(
                    fontSize: 11,
                    color: isDark ? Colors.white60 : Colors.grey.shade600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          LayoutBuilder(
            builder: (context, constraints) {
              final isWide = constraints.maxWidth > 750;
              return GridView.count(
                crossAxisCount: isWide ? 4 : 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: isWide ? 1.6 : 1.35,
                children: [
                  _buildHighlightBox(
                    label: 'Công việc hoàn thành',
                    value: '$completedTasks việc',
                    subtext: 'Đạt 100% tiến độ',
                    color: const Color(0xFF10B981),
                    icon: Icons.task_alt,
                    isDark: isDark,
                  ),
                  _buildHighlightBox(
                    label: 'Công việc chưa hoàn thành',
                    value: '$uncompletedTasks việc',
                    subtext: 'Cần tiếp tục xử lý',
                    color: const Color(0xFFEF4444),
                    icon: Icons.pending_actions,
                    isDark: isDark,
                  ),
                  _buildHighlightBox(
                    label: 'Tổng giá trị công việc',
                    value: '${currencyFmt.format(totalTaskValue)} đ',
                    subtext: 'Quy mô $totalTasks công việc',
                    color: isDark ? Colors.white : Colors.black,
                    icon: Icons.work_outline,
                    isDark: isDark,
                  ),
                  _buildHighlightBox(
                    label: 'Tổng chi tiêu sinh hoạt',
                    value: '${currencyFmt.format(totalExpenses)} đ',
                    subtext: 'Ăn uống, thuê nhà & hóa đơn',
                    color: const Color(0xFFEAB308),
                    icon: Icons.payments_outlined,
                    isDark: isDark,
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildHighlightBox({
    required String label,
    required String value,
    required String subtext,
    required Color color,
    required IconData icon,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF262626) : const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isDark ? Colors.white70 : const Color(0xFF4B5563),
                ),
              ),
              Icon(icon, size: 16, color: color),
            ],
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            subtext,
            style: TextStyle(
              fontSize: 11,
              color: isDark ? Colors.white54 : const Color(0xFF9CA3AF),
            ),
          ),
        ],
      ),
    );
  }

  // Phân tích riêng mục Công việc
  Widget _buildTasksAnalysisSection(
    List<TaskModel> tasks,
    bool isDark,
    NumberFormat currencyFmt,
  ) {
    // Group by category
    final Map<String, int> catCounts = {};
    for (var t in tasks) {
      catCounts[t.category] = (catCounts[t.category] ?? 0) + 1;
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.business_center_outlined, size: 20, color: isDark ? Colors.white : Colors.black),
              const SizedBox(width: 8),
              Text(
                'Phân tích chi tiết: Công việc',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : const Color(0xFF111827),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Phân loại theo danh mục công việc:',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white70 : const Color(0xFF4B5563),
            ),
          ),
          const SizedBox(height: 10),
          ...catCounts.entries.map((entry) {
            final percentage = tasks.isEmpty ? 0.0 : (entry.value / tasks.length);
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        entry.key,
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? Colors.white : const Color(0xFF111827),
                        ),
                      ),
                      Text(
                        '${entry.value} việc (${(percentage * 100).toStringAsFixed(0)}%)',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white70 : const Color(0xFF4B5563),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: percentage,
                      minHeight: 5,
                      backgroundColor: isDark ? Colors.white12 : Colors.grey.shade200,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // Phân tích riêng mục Sinh hoạt
  Widget _buildLivingAnalysisSection(
    List<ExpenseModel> expenses,
    bool isDark,
    NumberFormat currencyFmt,
  ) {
    final Map<String, double> catAmounts = {};
    double total = 0.0;
    for (var e in expenses) {
      final amt = double.tryParse(e.value) ?? 0.0;
      catAmounts[e.category] = (catAmounts[e.category] ?? 0.0) + amt;
      total += amt;
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.account_balance_wallet_outlined, size: 20, color: Color(0xFFEAB308)),
              const SizedBox(width: 8),
              Text(
                'Phân tích chi tiết: Sinh hoạt & Chi tiêu',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : const Color(0xFF111827),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Phân loại cơ cấu chi tiêu sinh hoạt:',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white70 : const Color(0xFF4B5563),
            ),
          ),
          const SizedBox(height: 10),
          ...catAmounts.entries.map((entry) {
            final percentage = total == 0 ? 0.0 : (entry.value / total);
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        entry.key,
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? Colors.white : const Color(0xFF111827),
                        ),
                      ),
                      Text(
                        '${currencyFmt.format(entry.value)} đ (${(percentage * 100).toStringAsFixed(0)}%)',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFFEAB308),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: percentage,
                      minHeight: 5,
                      backgroundColor: isDark ? Colors.white12 : Colors.grey.shade200,
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFEAB308)),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
