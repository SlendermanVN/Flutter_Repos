import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'controllers/task_controller.dart';
import 'controllers/expense_controller.dart';
import 'views/home/index.dart';
import 'views/works/index.dart';
import 'views/statistics/index.dart';
import 'views/settings/index.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TaskController()),
        ChangeNotifierProvider(create: (_) => ExpenseController()),
      ],
      child: const WorkLifeApp(),
    ),
  );
}

class WorkLifeApp extends StatefulWidget {
  const WorkLifeApp({super.key});

  @override
  State<WorkLifeApp> createState() => _WorkLifeAppState();
}

class _WorkLifeAppState extends State<WorkLifeApp> {
  // Theme mode: light or dark
  ThemeMode _themeMode = ThemeMode.dark;

  void _updateThemeMode(ThemeMode mode) {
    setState(() {
      _themeMode = mode;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Theme definition following user specifications:
    // Sáng: tông màu trắng chủ đạo, đen xám viền
    // Tối: tông màu đen xám chủ đạo, trắng viền
    final lightTheme = ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF9FAFB),
      primaryColor: Colors.black,
      colorScheme: const ColorScheme.light(
        primary: Colors.black,
        secondary: Color(0xFF374151),
        surface: Colors.white,
        background: Color(0xFFF9FAFB),
        outline: Color(0xFFD1D5DB), // Đen xám viền
      ),
      dividerColor: const Color(0xFFE5E7EB),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: Color(0xFFE5E7EB), width: 1),
        ),
      ),
    );

    final darkTheme = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: const Color(0xFF121212), // Đen xám chủ đạo
      primaryColor: Colors.white,
      colorScheme: ColorScheme.dark(
        primary: Colors.white,
        secondary: const Color(0xFFD1D5DB),
        surface: const Color(0xFF1E1E1E),
        background: const Color(0xFF121212),
        outline: Colors.white.withOpacity(0.18), // Trắng viền
      ),
      dividerColor: Colors.white.withOpacity(0.12),
      cardTheme: CardThemeData(
        color: const Color(0xFF1E1E1E),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: BorderSide(color: Colors.white.withOpacity(0.15), width: 1),
        ),
      ),
    );

    return MaterialApp(
      title: 'WorkLife Manager',
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: _themeMode,
      home: MainShell(
        themeMode: _themeMode,
        onThemeChanged: _updateThemeMode,
      ),
    );
  }
}

class MainShell extends StatefulWidget {
  final ThemeMode themeMode;
  final Function(ThemeMode) onThemeChanged;

  const MainShell({
    super.key,
    required this.themeMode,
    required this.onThemeChanged,
  });

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  // Active page index: 0 = Home, 1 = Works, 2 = Statistics, 3 = Settings
  int _currentIndex = 0;

  final List<String> _pageTitles = [
    'Trang Chủ',
    'Quản Lý Công Việc & Sinh Hoạt',
    'Tổng Hợp & Thống Kê',
    'Cài Đặt',
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // Build pages
    final pages = [
      HomeView(
        onNavigateToWorks: () => setState(() => _currentIndex = 1),
        onNavigateToStats: () => setState(() => _currentIndex = 2),
      ),
      const WorksView(),
      const StatisticsView(),
      SettingsView(
        currentThemeMode: widget.themeMode,
        onThemeModeChanged: widget.onThemeChanged,
      ),
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        // Desktop breakpoint (> 768px): Dashboard sidebar on the left
        // Mobile breakpoint (<= 768px): Navigation bar on the bottom
        final isDesktop = constraints.maxWidth > 768;

        if (isDesktop) {
          // GIAO DIỆN DESKTOP APP: Dashboard sidebar ở phía bên trái
          return Scaffold(
            body: Row(
              children: [
                // Left Desktop Sidebar
                _buildDesktopSidebar(isDark),
                // Main Content Area
                Expanded(
                  child: Column(
                    children: [
                      // Desktop Top Header
                      _buildDesktopHeader(isDark),
                      // Active View Body
                      Expanded(
                        child: pages[_currentIndex],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        } else {
          // GIAO DIỆN MOBILE APP: Mục chọn các trang ở phía dưới giao diện
          return Scaffold(
            appBar: AppBar(
              title: Text(
                _pageTitles[_currentIndex],
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              centerTitle: true,
              backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
              elevation: 0,
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(1),
                child: Container(
                  color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
                  height: 1,
                ),
              ),
              actions: [
                IconButton(
                  icon: Icon(
                    widget.themeMode == ThemeMode.dark ? Icons.light_mode : Icons.dark_mode,
                    size: 20,
                  ),
                  onPressed: () {
                    widget.onThemeChanged(
                      widget.themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark,
                    );
                  },
                ),
              ],
            ),
            body: pages[_currentIndex],
            bottomNavigationBar: Container(
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: isDark ? Colors.white12 : const Color(0xFFE5E7EB),
                    width: 1,
                  ),
                ),
              ),
              child: BottomNavigationBar(
                currentIndex: _currentIndex,
                onTap: (index) => setState(() => _currentIndex = index),
                type: BottomNavigationBarType.fixed,
                backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                selectedItemColor: isDark ? Colors.white : Colors.black,
                unselectedItemColor: isDark ? Colors.white54 : const Color(0xFF6B7280),
                selectedFontSize: 11,
                unselectedFontSize: 11,
                items: const [
                  BottomNavigationBarItem(
                    icon: Icon(Icons.home_outlined),
                    activeIcon: Icon(Icons.home),
                    label: 'Trang chủ',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.assignment_outlined),
                    activeIcon: Icon(Icons.assignment),
                    label: 'Công việc',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.bar_chart_outlined),
                    activeIcon: Icon(Icons.bar_chart),
                    label: 'Thống kê',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.settings_outlined),
                    activeIcon: Icon(Icons.settings),
                    label: 'Cài đặt',
                  ),
                ],
              ),
            ),
          );
        }
      },
    );
  }

  // Desktop Left Sidebar Dashboard
  Widget _buildDesktopSidebar(bool isDark) {
    return Container(
      width: 250,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF18181B) : Colors.white,
        border: Border(
          right: BorderSide(
            color: isDark ? Colors.white.withOpacity(0.12) : const Color(0xFFE5E7EB),
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: [
          // App Logo / Title
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            alignment: Alignment.centerLeft,
            child: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white : Colors.black,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    'W',
                    style: TextStyle(
                      color: isDark ? Colors.black : Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  'WorkLife',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.5,
                    color: isDark ? Colors.white : const Color(0xFF111827),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1),
          const SizedBox(height: 16),

          // Nav Items
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Column(
              children: [
                _buildSidebarItem(0, 'Trang chủ', Icons.home_outlined, Icons.home, isDark),
                const SizedBox(height: 4),
                _buildSidebarItem(1, 'Công việc & Sinh hoạt', Icons.assignment_outlined, Icons.assignment, isDark),
                const SizedBox(height: 4),
                _buildSidebarItem(2, 'Tổng hợp & Thống kê', Icons.bar_chart_outlined, Icons.bar_chart, isDark),
                const SizedBox(height: 4),
                _buildSidebarItem(3, 'Cài đặt hệ thống', Icons.settings_outlined, Icons.settings, isDark),
              ],
            ),
          ),

          const Spacer(),

          // Theme quick toggle in footer
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF27272A) : const Color(0xFFF3F4F6),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      widget.themeMode == ThemeMode.dark ? Icons.dark_mode : Icons.light_mode,
                      size: 18,
                      color: isDark ? Colors.white : Colors.black,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      widget.themeMode == ThemeMode.dark ? 'Chế độ tối' : 'Chế độ sáng',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                  ],
                ),
                Switch(
                  value: widget.themeMode == ThemeMode.dark,
                  onChanged: (val) {
                    widget.onThemeChanged(val ? ThemeMode.dark : ThemeMode.light);
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebarItem(
    int index,
    String label,
    IconData icon,
    IconData activeIcon,
    bool isDark,
  ) {
    final isSelected = _currentIndex == index;
    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark ? Colors.white : Colors.black)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? activeIcon : icon,
              size: 18,
              color: isSelected
                  ? (isDark ? Colors.black : Colors.white)
                  : (isDark ? Colors.white70 : const Color(0xFF4B5563)),
            ),
            const SizedBox(width: 12),
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
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

  Widget _buildDesktopHeader(bool isDark) {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF18181B) : Colors.white,
        border: Border(
          bottom: BorderSide(
            color: isDark ? Colors.white.withOpacity(0.12) : const Color(0xFFE5E7EB),
            width: 1,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            _pageTitles[_currentIndex],
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : const Color(0xFF111827),
            ),
          ),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isDark ? Colors.white10 : const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'WorkLife Desktop Edition',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: isDark ? Colors.white70 : const Color(0xFF4B5563),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
