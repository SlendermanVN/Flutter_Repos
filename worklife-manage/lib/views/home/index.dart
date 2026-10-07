import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../controllers/task_controller.dart';
import '../../controllers/expense_controller.dart';

class HomeView extends StatefulWidget {
  final VoidCallback? onNavigateToWorks;
  final VoidCallback? onNavigateToStats;

  const HomeView({super.key, this.onNavigateToWorks, this.onNavigateToStats});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  int _pastDays = 7;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final taskCtrl = context.watch<TaskController>();
    final expCtrl = context.watch<ExpenseController>();

    final pastTasks = taskCtrl.getTasksInPastDays(_pastDays);
    final pastExpenses = expCtrl.getExpensesInPastDays(_pastDays);

    final completedTasks = pastTasks.where((t) => t.isCompleted).length;
    final completionRate = pastTasks.isEmpty ? 0.0 : (completedTasks / pastTasks.length) * 100;

    double totalExpenseAmount = 0.0;
    for (var e in pastExpenses) {
      totalExpenseAmount += double.tryParse(e.value) ?? 0.0;
    }

    final currencyFmt = NumberFormat('#,###', 'vi_VN');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting & Quick Intro
          Text(
            'Tổng quan & Tính năng nổi bật',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : const Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Hệ thống quản lý công việc và sinh hoạt chuẩn Desktop & Mobile.',
            style: TextStyle(
              fontSize: 14,
              color: isDark ? Colors.white70 : const Color(0xFF6B7280),
            ),
          ),
          const SizedBox(height: 24),

          // Features Spotlight Cards (Mục liệt kê tính năng nổi bật)
          _buildFeatureSpotlight(isDark),

          const SizedBox(height: 32),

          // Dashboard section header with `n` days selector
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Bảng Dashboard số liệu',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : const Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Số liệu tổng hợp trong $_pastDays ngày gần nhất',
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
              // Segmented selector for past n days
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
                  children: [7, 14, 30].map((d) {
                    final selected = _pastDays == d;
                    return InkWell(
                      onTap: () => setState(() => _pastDays = d),
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, py: 6),
                        decoration: BoxDecoration(
                          color: selected
                              ? (isDark ? Colors.white : Colors.black)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '$d ngày',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: selected
                                ? (isDark ? Colors.black : Colors.white)
                                : (isDark ? Colors.white70 : const Color(0xFF4B5563)),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // 4 Metric Highlight Cards
          LayoutBuilder(
            builder: (context, constraints) {
              final isWide = constraints.maxWidth > 700;
              return GridView.count(
                crossAxisCount: isWide ? 4 : 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: isWide ? 1.6 : 1.3,
                children: [
                  _buildMetricCard(
                    title: 'Tổng công việc',
                    value: '${pastTasks.length}',
                    subtext: '$completedTasks đã xong / ${pastTasks.length - completedTasks} chưa xong',
                    icon: Icons.assignment_outlined,
                    isDark: isDark,
                  ),
                  _buildMetricCard(
                    title: 'Tỷ lệ hoàn thành',
                    value: '${completionRate.toStringAsFixed(1)}%',
                    subtext: '${completedTasks} việc đạt tiến độ 100%',
                    icon: Icons.check_circle_outline,
                    isDark: isDark,
                    highlightColor: const Color(0xFF10B981),
                  ),
                  _buildMetricCard(
                    title: 'Chi tiêu sinh hoạt',
                    value: '${currencyFmt.format(totalExpenseAmount)} đ',
                    subtext: '${pastExpenses.length} khoản chi phí ghi nhận',
                    icon: Icons.account_balance_wallet_outlined,
                    isDark: isDark,
                    highlightColor: const Color(0xFFEAB308),
                  ),
                  _buildMetricCard(
                    title: 'Tổng số mục sinh hoạt',
                    value: '${pastExpenses.length}',
                    subtext: 'Ăn uống, tiền nhà, hóa đơn...',
                    icon: Icons.local_activity_outlined,
                    isDark: isDark,
                  ),
                ],
              );
            },
          ),

          const SizedBox(height: 32),

          // Quick Action Banner
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Bắt đầu quản lý công việc và sinh hoạt ngay hôm nay',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : const Color(0xFF111827),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Theo dõi tiến độ, kiểm soát chi tiêu và xem thống kê báo cáo.',
                        style: TextStyle(
                          fontSize: 13,
                          color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                        ),
                      ),
                    ],
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: widget.onNavigateToWorks,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isDark ? Colors.white : Colors.black,
                    foregroundColor: isDark ? Colors.black : Colors.white,
                    shape: RoundedRectangle.circular(10),
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                  ),
                  icon: const Icon(Icons.arrow_forward, size: 16),
                  label: const Text('Đến Quản Lý', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureSpotlight(bool isDark) {
    final features = [
      {
        'title': 'CRUD Công việc & Mức độ %',
        'desc': 'Quản lý tên, loại, giá trị (chữ/số), ngày giờ và tiến độ hoàn thành từ 0-100%.',
        'icon': Icons.task_alt,
      },
      {
        'title': 'Quản lý sinh hoạt linh hoạt',
        'desc': 'Kiểm soát chi tiêu, hóa đơn, ăn uống với chuyển đổi chế độ một chạm mượt mà.',
        'icon': Icons.receipt_long,
      },
      {
        'title': 'Lịch thu nhỏ chỉ báo màu',
        'desc': 'Chấm đỏ: việc chưa xong, Chấm xanh lá: đã hoàn thành, Chấm vàng: có sinh hoạt.',
        'icon': Icons.calendar_month,
      },
      {
        'title': 'Báo cáo Tuần / Tháng / Năm',
        'desc': 'Tổng hợp KPI nổi bật, phân bổ chi phí và thống kê tỷ lệ hoàn thành trực quan.',
        'icon': Icons.bar_chart,
      },
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 800;
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: features.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: isWide ? 4 : 2,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            childAspectRatio: isWide ? 1.5 : 1.25,
          ),
          itemBuilder: (context, i) {
            final f = features[i];
            return Container(
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
                  Icon(f['icon'] as IconData, size: 24, color: isDark ? Colors.white : Colors.black),
                  const Spacer(),
                  Text(
                    f['title'] as String,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : const Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    f['desc'] as String,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtext,
    required IconData icon,
    required bool isDark,
    Color? highlightColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
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
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: isDark ? Colors.white70 : const Color(0xFF4B5563),
                ),
              ),
              Icon(icon, size: 18, color: highlightColor ?? (isDark ? Colors.white54 : Colors.black45)),
            ],
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              letterSpacing: -0.5,
              color: highlightColor ?? (isDark ? Colors.white : const Color(0xFF111827)),
            ),
          ),
          Text(
            subtext,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 11,
              color: isDark ? Colors.white54 : const Color(0xFF9CA3AF),
            ),
          ),
        ],
      ),
    );
  }
}
