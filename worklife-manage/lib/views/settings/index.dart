import 'package:flutter/material.dart';

class SettingsView extends StatefulWidget {
  final ThemeMode currentThemeMode;
  final Function(ThemeMode) onThemeModeChanged;

  const SettingsView({
    super.key,
    required this.currentThemeMode,
    required this.onThemeModeChanged,
  });

  @override
  State<SettingsView> createState() => _SettingsViewState();
}

class _SettingsViewState extends State<SettingsView> {
  // Account state
  String _fullName = 'Nguyễn Lê Anh Đức';
  String _email = 'nguyenleanhduc2004@gmail.com';
  String _currency = 'VND (₫)';

  // Feature state
  bool _taskReminder = true;
  bool _autoSync = true;
  bool _soundEnabled = false;
  String _defaultView = 'Tháng';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Text(
            'Cài đặt hệ thống',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : const Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Quản lý tài khoản, cấu hình tính năng và tùy biến giao diện sáng / tối.',
            style: TextStyle(
              fontSize: 13,
              color: isDark ? Colors.white60 : const Color(0xFF6B7280),
            ),
          ),
          const SizedBox(height: 24),

          // 1. Cài đặt Giao diện (Sáng / Tối) - Tuân thủ quy chuẩn thiết kế người dùng yêu cầu:
          // Sáng: tông màu trắng chủ đạo, đen xám viền
          // Tối: tông màu đen xám chủ đạo, trắng viền
          _buildCard(
            title: '1. Cài đặt Giao diện (Theme Mode)',
            subtitle: 'Chế độ sáng: nền trắng chủ đạo, viền đen xám. Chế độ tối: nền đen xám chủ đạo, viền trắng.',
            isDark: isDark,
            child: Row(
              children: [
                Expanded(
                  child: _buildThemeOptionCard(
                    title: 'Giao diện Sáng (Light)',
                    desc: 'Nền trắng sáng, viền đen xám',
                    isSelected: widget.currentThemeMode == ThemeMode.light,
                    isDark: isDark,
                    onTap: () => widget.onThemeModeChanged(ThemeMode.light),
                    previewBg: Colors.white,
                    previewBorder: const Color(0xFF9CA3AF),
                    previewText: Colors.black,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildThemeOptionCard(
                    title: 'Giao diện Tối (Dark)',
                    desc: 'Nền đen xám chủ đạo, viền trắng',
                    isSelected: widget.currentThemeMode == ThemeMode.dark,
                    isDark: isDark,
                    onTap: () => widget.onThemeModeChanged(ThemeMode.dark),
                    previewBg: const Color(0xFF121212),
                    previewBorder: Colors.white70,
                    previewText: Colors.white,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // 2. Cài đặt Tài khoản
          _buildCard(
            title: '2. Cài đặt Tài khoản',
            subtitle: 'Thông tin cá nhân, định dạng tiền tệ và bảo mật.',
            isDark: isDark,
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: isDark ? Colors.white24 : Colors.grey.shade300,
                      child: Text(
                        _fullName.substring(0, 1),
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : Colors.black87,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _fullName,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: isDark ? Colors.white : const Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _email,
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                            ),
                          ),
                        ],
                      ),
                    ),
                    OutlinedButton(
                      onPressed: () => _showEditProfileDialog(context),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(
                          color: isDark ? Colors.white30 : const Color(0xFFD1D5DB),
                        ),
                      ),
                      child: const Text('Chỉnh sửa'),
                    ),
                  ],
                ),
                const Divider(height: 32),
                _buildSettingRow(
                  title: 'Đơn vị tiền tệ hiển thị',
                  subtitle: 'Đang dùng: $_currency',
                  isDark: isDark,
                  action: DropdownButton<String>(
                    value: _currency,
                    underline: const SizedBox.shrink(),
                    items: ['VND (₫)', 'USD (\$)'].map((c) {
                      return DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontSize: 13)));
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _currency = val);
                    },
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // 3. Cài đặt Tính năng
          _buildCard(
            title: '3. Cài đặt Tính năng',
            subtitle: 'Tùy chỉnh thông báo nhắc việc, đồng bộ máy chủ và sao lưu dữ liệu.',
            isDark: isDark,
            child: Column(
              children: [
                _buildSwitchRow(
                  title: 'Nhắc nhở công việc sắp đến hạn',
                  subtitle: 'Gửi thông báo trước 30 phút khi công việc bắt đầu',
                  value: _taskReminder,
                  isDark: isDark,
                  onChanged: (v) => setState(() => _taskReminder = v),
                ),
                const Divider(height: 24),
                _buildSwitchRow(
                  title: 'Tự động đồng bộ với Cloud Database Server',
                  subtitle: 'Đồng bộ hóa tức thì mỗi khi thêm/sửa/xóa công việc hoặc sinh hoạt',
                  value: _autoSync,
                  isDark: isDark,
                  onChanged: (v) => setState(() => _autoSync = v),
                ),
                const Divider(height: 24),
                _buildSettingRow(
                  title: 'Chu kỳ thống kê mặc định',
                  subtitle: 'Lựa chọn hiển thị khi mở trang Thống kê',
                  isDark: isDark,
                  action: DropdownButton<String>(
                    value: _defaultView,
                    underline: const SizedBox.shrink(),
                    items: ['Tuần', 'Tháng', 'Năm'].map((p) {
                      return DropdownMenuItem(value: p, child: Text(p, style: const TextStyle(fontSize: 13)));
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _defaultView = val);
                    },
                  ),
                ),
                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Xuất dữ liệu dự phòng (Backup)',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: isDark ? Colors.white : const Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Tải về file JSON / CSV để lưu trữ nội bộ',
                          style: TextStyle(
                            fontSize: 12,
                            color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                          ),
                        ),
                      ],
                    ),
                    OutlinedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Đã xuất dữ liệu sao lưu thành công (JSON)!')),
                        );
                      },
                      icon: const Icon(Icons.file_download_outlined, size: 16),
                      label: const Text('Xuất file'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCard({
    required String title,
    required String subtitle,
    required Widget child,
    required bool isDark,
  }) {
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
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : const Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white60 : const Color(0xFF6B7280),
            ),
          ),
          const SizedBox(height: 18),
          child,
        ],
      ),
    );
  }

  Widget _buildThemeOptionCard({
    required String title,
    required String desc,
    required bool isSelected,
    required bool isDark,
    required VoidCallback onTap,
    required Color previewBg,
    required Color previewBorder,
    required Color previewText,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark ? Colors.white10 : Colors.grey.shade50)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? (isDark ? Colors.white : Colors.black)
                : (isDark ? Colors.white12 : const Color(0xFFE5E7EB)),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Preview swatch
            Container(
              height: 48,
              width: double.infinity,
              decoration: BoxDecoration(
                color: previewBg,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: previewBorder, width: 1.5),
              ),
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  Container(width: 8, height: 8, decoration: BoxDecoration(color: previewText, shape: BoxShape.circle)),
                  const SizedBox(width: 6),
                  Container(width: 40, height: 6, decoration: BoxDecoration(color: previewText.withOpacity(0.5), borderRadius: BorderRadius.circular(3))),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF111827),
                  ),
                ),
                if (isSelected)
                  const Icon(Icons.check_circle, size: 18, color: Color(0xFF10B981)),
              ],
            ),
            const SizedBox(height: 2),
            Text(
              desc,
              style: TextStyle(
                fontSize: 11,
                color: isDark ? Colors.white60 : const Color(0xFF6B7280),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchRow({
    required String title,
    required String subtitle,
    required bool value,
    required bool isDark,
    required ValueChanged<bool> onChanged,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: isDark ? Colors.white : const Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 11,
                  color: isDark ? Colors.white60 : const Color(0xFF6B7280),
                ),
              ),
            ],
          ),
        ),
        Switch(
          value: value,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildSettingRow({
    required String title,
    required String subtitle,
    required bool isDark,
    required Widget action,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.white : const Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 11,
                color: isDark ? Colors.white60 : const Color(0xFF6B7280),
              ),
            ),
          ],
        ),
        action,
      ],
    );
  }

  void _showEditProfileDialog(BuildContext context) {
    final nameCtrl = TextEditingController(text: _fullName);
    final emailCtrl = TextEditingController(text: _email);

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Cập nhật thông tin tài khoản'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'Họ và tên'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: emailCtrl,
                decoration: const InputDecoration(labelText: 'Email'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Hủy'),
            ),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _fullName = nameCtrl.text;
                  _email = emailCtrl.text;
                });
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
