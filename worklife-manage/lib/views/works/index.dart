import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../models/task_model.dart';
import '../../models/expense_model.dart';
import '../../controllers/task_controller.dart';
import '../../controllers/expense_controller.dart';
import '../calendars/index.dart';

class WorksView extends StatefulWidget {
  const WorksView({super.key});

  @override
  State<WorksView> createState() => _WorksViewState();
}

class _WorksViewState extends State<WorksView> {
  // Mode: 0 = Quản lý công việc (Tasks), 1 = Quản lý sinh hoạt (Living/Expenses)
  int _selectedMode = 0;
  String _statsPeriod = 'month'; // 'week', 'month', 'year'

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final taskCtrl = context.watch<TaskController>();
    final expCtrl = context.watch<ExpenseController>();

    final selectedDateStr = DateFormat('dd/MM/yyyy').format(taskCtrl.selectedDate);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // 1. Top Center Switcher (Nút chuyển đổi phần quản lý công việc và sinh hoạt nằm trên cùng ở giữa)
          Center(
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildTabOption(
                    title: 'Quản lý công việc',
                    index: 0,
                    icon: Icons.assignment_turned_in_outlined,
                    isDark: isDark,
                  ),
                  _buildTabOption(
                    title: 'Quản lý sinh hoạt',
                    index: 1,
                    icon: Icons.account_balance_wallet_outlined,
                    isDark: isDark,
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // 2. Main Content Layout (Desktop: Side-by-side or stacked on mobile)
          LayoutBuilder(
            builder: (context, constraints) {
              final isDesktop = constraints.maxWidth > 900;
              if (isDesktop) {
                return Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Left Column: Mini Calendar & Filter State
                    SizedBox(
                      width: 340,
                      child: Column(
                        children: [
                          const MiniCalendarWidget(),
                          const SizedBox(height: 16),
                          _buildSelectedDateCard(selectedDateStr, isDark, taskCtrl, expCtrl),
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),
                    // Right Column: CRUD List & Add Button
                    Expanded(
                      child: _buildCrudSection(isDark, taskCtrl, expCtrl),
                    ),
                  ],
                );
              } else {
                return Column(
                  children: [
                    const MiniCalendarWidget(),
                    const SizedBox(height: 16),
                    _buildSelectedDateCard(selectedDateStr, isDark, taskCtrl, expCtrl),
                    const SizedBox(height: 24),
                    _buildCrudSection(isDark, taskCtrl, expCtrl),
                  ],
                );
              }
            },
          ),

          const SizedBox(height: 36),

          // 3. Bottom Summary Section (Mục thống kê số lượng công việc, chi tiêu ở cuối tổng hợp hàng tuần/tháng/năm)
          _buildBottomSummary(isDark, taskCtrl, expCtrl),
        ],
      ),
    );
  }

  Widget _buildTabOption({
    required String title,
    required int index,
    required IconData icon,
    required bool isDark,
  }) {
    final isSelected = _selectedMode == index;
    return InkWell(
      onTap: () => setState(() => _selectedMode = index),
      borderRadius: BorderRadius.circular(10),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark ? Colors.white : Colors.black)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected
                  ? (isDark ? Colors.black : Colors.white)
                  : (isDark ? Colors.white70 : const Color(0xFF4B5563)),
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isSelected
                    ? (isDark ? Colors.black : Colors.white)
                    : (isDark ? Colors.white70 : const Color(0xFF4B5563)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectedDateCard(
    String dateStr,
    bool isDark,
    TaskController taskCtrl,
    ExpenseController expCtrl,
  ) {
    final dayTasks = taskCtrl.tasksForSelectedDate;
    final dayExpenses = expCtrl.expensesForSelectedDate;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Ngày được chọn',
                style: TextStyle(
                  fontSize: 12,
                  color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                ),
              ),
              Text(
                dateStr,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : const Color(0xFF111827),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '• Có ${dayTasks.length} công việc (${dayTasks.where((t) => t.isCompleted).length} hoàn thành)',
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white70 : const Color(0xFF4B5563),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '• Có ${dayExpenses.length} sinh hoạt ghi nhận',
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white70 : const Color(0xFF4B5563),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCrudSection(
    bool isDark,
    TaskController taskCtrl,
    ExpenseController expCtrl,
  ) {
    final isTaskMode = _selectedMode == 0;
    final dayTasks = taskCtrl.tasksForSelectedDate;
    final dayExpenses = expCtrl.expensesForSelectedDate;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header with title and "Add New" button
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isTaskMode ? 'Danh sách công việc' : 'Danh sách sinh hoạt & chi tiêu',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  isTaskMode
                      ? 'Kèm giờ/ngày, loại, giá trị và mức độ hoàn thành %'
                      : 'Kèm giờ/ngày, loại và giá trị chi tiêu',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
            ElevatedButton.icon(
              onPressed: () {
                if (isTaskMode) {
                  _showTaskDialog(context, null);
                } else {
                  _showExpenseDialog(context, null);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: isDark ? Colors.white : Colors.black,
                foregroundColor: isDark ? Colors.black : Colors.white,
                shape: RoundedRectangle.circular(10),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              ),
              icon: const Icon(Icons.add, size: 16),
              label: Text(
                isTaskMode ? 'Thêm công việc' : 'Thêm sinh hoạt',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

        // List items or empty state
        if (isTaskMode) ...[
          if (dayTasks.isEmpty)
            _buildEmptyState(
              'Không có công việc nào trong ngày này.',
              'Nhấn "Thêm công việc" để lập kế hoạch ngay.',
              isDark,
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: dayTasks.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final task = dayTasks[index];
                return _buildTaskCard(task, isDark, taskCtrl);
              },
            ),
        ] else ...[
          if (dayExpenses.isEmpty)
            _buildEmptyState(
              'Không có mục sinh hoạt nào trong ngày này.',
              'Nhấn "Thêm sinh hoạt" để ghi chép chi phí hoặc sinh hoạt.',
              isDark,
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: dayExpenses.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final expense = dayExpenses[index];
                return _buildExpenseCard(expense, isDark, expCtrl);
              },
            ),
        ],
      ],
    );
  }

  Widget _buildEmptyState(String title, String desc, bool isDark) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
        ),
      ),
      child: Column(
        children: [
          Icon(Icons.inbox_outlined, size: 40, color: isDark ? Colors.white38 : Colors.grey.shade400),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white : const Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            desc,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white60 : const Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTaskCard(TaskModel task, bool isDark, TaskController ctrl) {
    final timeFmt = DateFormat('HH:mm - dd/MM');
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: task.isCompleted
              ? const Color(0xFF10B981).withOpacity(0.5)
              : (isDark ? Colors.white12 : const Color(0xFFE5E7EB)),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      task.title,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                        color: isDark ? Colors.white : const Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Loại: ${task.category}  ·  Giá trị: ${task.value}  ·  Từ: ${timeFmt.format(task.startTime)} đến ${timeFmt.format(task.endTime)}',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                      ),
                    ),
                  ],
                ),
              ),
              // Action buttons (Edit & Delete)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.edit_outlined, size: 18),
                    onPressed: () => _showTaskDialog(context, task),
                    visualDensity: VisualDensity.compact,
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, size: 18),
                    color: Colors.red.shade400,
                    onPressed: () => ctrl.deleteTask(task.id),
                    visualDensity: VisualDensity.compact,
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Mức độ hoàn thành (%) - chỉ có ở mục quản lý công việc!
          Row(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: task.progress / 100.0,
                    minHeight: 6,
                    backgroundColor: isDark ? Colors.white12 : Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      task.isCompleted ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                '${task.progress}%',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: task.isCompleted ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                ),
              ),
              const SizedBox(width: 8),
              // Quick toggle 100% button
              TextButton(
                onPressed: () {
                  ctrl.updateProgress(task.id, task.isCompleted ? 0 : 100);
                },
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text(
                  task.isCompleted ? 'Đánh dấu chưa xong' : 'Xong ngay',
                  style: TextStyle(
                    fontSize: 11,
                    color: isDark ? Colors.white70 : Colors.black87,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildExpenseCard(ExpenseModel expense, bool isDark, ExpenseController ctrl) {
    final timeFmt = DateFormat('HH:mm - dd/MM');
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  expense.title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Loại: ${expense.category}  ·  Giá trị: ${expense.value}  ·  Thời gian: ${timeFmt.format(expense.startTime)} - ${timeFmt.format(expense.endTime)}',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                  ),
                ),
                if (expense.notes != null && expense.notes!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Ghi chú: ${expense.notes}',
                    style: TextStyle(
                      fontSize: 11,
                      fontStyle: FontStyle.italic,
                      color: isDark ? Colors.white54 : Colors.grey.shade600,
                    ),
                  ),
                ],
              ],
            ),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.edit_outlined, size: 18),
                onPressed: () => _showExpenseDialog(context, expense),
                visualDensity: VisualDensity.compact,
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, size: 18),
                color: Colors.red.shade400,
                onPressed: () => ctrl.deleteExpense(expense.id),
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 3. Mục thống kê số lượng công việc, chi tiêu ở cuối với dữ liệu được tổng hợp hàng tuần/tháng/năm hiện tại
  Widget _buildBottomSummary(
    bool isDark,
    TaskController taskCtrl,
    ExpenseController expCtrl,
  ) {
    final currencyFmt = NumberFormat('#,###', 'vi_VN');

    return Container(
      width: double.infinity,
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Thống kê tổng hợp số lượng công việc & chi tiêu',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : const Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Dữ liệu chu kỳ hiện tại',
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
              // Filter period buttons: Tuần / Tháng / Năm hiện tại
              Row(
                children: [
                  _buildPeriodBtn('Tuần này', 'week', isDark),
                  const SizedBox(width: 6),
                  _buildPeriodBtn('Tháng này', 'month', isDark),
                  const SizedBox(width: 6),
                  _buildPeriodBtn('Năm nay', 'year', isDark),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: _buildSummaryBox(
                  label: 'Tổng công việc',
                  value: '${taskCtrl.totalTasks}',
                  subvalue: '${taskCtrl.completedTasks} hoàn thành / ${taskCtrl.uncompletedTasks} đang làm',
                  isDark: isDark,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildSummaryBox(
                  label: 'Tổng chi tiêu sinh hoạt',
                  value: '${currencyFmt.format(expCtrl.totalExpenseAmount)} đ',
                  subvalue: '${expCtrl.totalExpensesCount} giao dịch sinh hoạt',
                  isDark: isDark,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildSummaryBox(
                  label: 'Tỷ lệ hoàn thành công việc',
                  value: '${taskCtrl.completionRate.toStringAsFixed(1)}%',
                  subvalue: 'Đánh giá tiến độ tổng quan',
                  isDark: isDark,
                  color: const Color(0xFF10B981),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodBtn(String label, String code, bool isDark) {
    final active = _statsPeriod == code;
    return InkWell(
      onTap: () => setState(() => _statsPeriod = code),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: active ? (isDark ? Colors.white : Colors.black) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: active
                ? Colors.transparent
                : (isDark ? Colors.white24 : const Color(0xFFD1D5DB)),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: active ? (isDark ? Colors.black : Colors.white) : (isDark ? Colors.white70 : Colors.black87),
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryBox({
    required String label,
    required String value,
    required String subvalue,
    required bool isDark,
    Color? color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF262626) : const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white60 : const Color(0xFF6B7280),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color ?? (isDark ? Colors.white : const Color(0xFF111827)),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subvalue,
            style: TextStyle(
              fontSize: 11,
              color: isDark ? Colors.white54 : const Color(0xFF9CA3AF),
            ),
          ),
        ],
      ),
    );
  }

  // Dialog for Task Add/Edit
  void _showTaskDialog(BuildContext context, TaskModel? existing) {
    final titleController = TextEditingController(text: existing?.title ?? '');
    final categoryController = TextEditingController(text: existing?.category ?? 'Dự án');
    final valueController = TextEditingController(text: existing?.value ?? '');
    final notesController = TextEditingController(text: existing?.notes ?? '');
    int progress = existing?.progress ?? 0;
    DateTime start = existing?.startTime ?? DateTime.now();
    DateTime end = existing?.endTime ?? DateTime.now().add(const Duration(hours: 2));

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDlgState) {
            return AlertDialog(
              title: Text(existing == null ? 'Thêm công việc mới' : 'Chỉnh sửa công việc'),
              content: SingleChildScrollView(
                child: SizedBox(
                  width: 440,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextField(
                        controller: titleController,
                        decoration: const InputDecoration(labelText: 'Tên công việc *'),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: categoryController,
                        decoration: const InputDecoration(labelText: 'Loại công việc (Dự án, Họp, Học tập, ...)'),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: valueController,
                        decoration: const InputDecoration(labelText: 'Giá trị (chữ hoặc số, ví dụ: 25000000 hoặc Cấp A)'),
                      ),
                      const SizedBox(height: 16),
                      // Progress slider (Mức độ hoàn thành - CHỈ CÓ Ở CÔNG VIỆC)
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Mức độ hoàn thành:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                              Text('$progress%', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          Slider(
                            value: progress.toDouble(),
                            min: 0,
                            max: 100,
                            divisions: 20,
                            onChanged: (v) {
                              setDlgState(() => progress = v.toInt());
                            },
                          ),
                        ],
                      ),
                      TextField(
                        controller: notesController,
                        decoration: const InputDecoration(labelText: 'Ghi chú thêm'),
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Hủy'),
                ),
                ElevatedButton(
                  onPressed: () {
                    if (titleController.text.trim().isEmpty) return;
                    final task = TaskModel(
                      id: existing?.id ?? 'tsk_${DateTime.now().millisecondsSinceEpoch}',
                      title: titleController.text.trim(),
                      category: categoryController.text.trim().isEmpty ? 'Chung' : categoryController.text.trim(),
                      value: valueController.text.trim(),
                      startTime: start,
                      endTime: end,
                      progress: progress,
                      notes: notesController.text.trim(),
                    );
                    final ctrl = context.read<TaskController>();
                    if (existing == null) {
                      ctrl.addTask(task);
                    } else {
                      ctrl.updateTask(task);
                    }
                    Navigator.pop(ctx);
                  },
                  child: const Text('Lưu'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Dialog for Expense Add/Edit
  void _showExpenseDialog(BuildContext context, ExpenseModel? existing) {
    final titleController = TextEditingController(text: existing?.title ?? '');
    final categoryController = TextEditingController(text: existing?.category ?? 'Ăn uống');
    final valueController = TextEditingController(text: existing?.value ?? '');
    final notesController = TextEditingController(text: existing?.notes ?? '');
    DateTime start = existing?.startTime ?? DateTime.now();
    DateTime end = existing?.endTime ?? DateTime.now().add(const Duration(hours: 1));

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: Text(existing == null ? 'Ghi nhận sinh hoạt mới' : 'Chỉnh sửa sinh hoạt'),
          content: SingleChildScrollView(
            child: SizedBox(
              width: 440,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(labelText: 'Tên sinh hoạt / khoản chi *'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: categoryController,
                    decoration: const InputDecoration(labelText: 'Loại sinh hoạt (Ăn uống, Tiền nhà, Mua sắm, ...)'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: valueController,
                    decoration: const InputDecoration(labelText: 'Giá trị (chữ hoặc số, ví dụ: 450000 đ hoặc Mua đồ siêu thị)'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: notesController,
                    decoration: const InputDecoration(labelText: 'Ghi chú thêm'),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Hủy'),
            ),
            ElevatedButton(
              onPressed: () {
                if (titleController.text.trim().isEmpty) return;
                final expense = ExpenseModel(
                  id: existing?.id ?? 'exp_${DateTime.now().millisecondsSinceEpoch}',
                  title: titleController.text.trim(),
                  category: categoryController.text.trim().isEmpty ? 'Ăn uống' : categoryController.text.trim(),
                  value: valueController.text.trim(),
                  startTime: start,
                  endTime: end,
                  notes: notesController.text.trim(),
                );
                final ctrl = context.read<ExpenseController>();
                if (existing == null) {
                  ctrl.addExpense(expense);
                } else {
                  ctrl.updateExpense(expense);
                }
                Navigator.pop(ctx);
              },
              child: const Text('Lưu'),
            ),
          ],
        );
      },
    );
  }
}
