# 🌙 Lunar Habit Tracker <img src="https://github.com/user-attachments/assets/70b463bc-0009-4bca-afde-ad97a40d0e74" alt="Logo" width="40"/>

*Build better habits, one day at a time*

A beautiful, intuitive habit tracking app built with React Native and Expo. Lunar helps you establish and maintain positive habits through an elegant interface with powerful tracking features.

![App Version](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue)
![Expo](https://img.shields.io/badge/Expo-~53.0.9-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.8.3-blue)

## ✨ Features

### 🎯 Core Functionality
- **Create Custom Habits** - Design habits with custom names, emojis, and frequency (daily/weekly)
- **Smart Calendar Navigation** - Swipe through weeks and months to track progress over time
- **Streak Tracking** - Visual streak counters to maintain motivation
- **Completion History** - Detailed views with list, weekly, and yearly progress visualizations
- **Habit Reordering** - Drag and drop to organize habits by priority

### 📱 User Experience
- **Intuitive Gestures** - Swipe on habits to navigate dates, swipe calendar for weeks
- **Haptic Feedback** - Tactile responses for all interactions
- **Dark/Light Themes** - Beautiful warm color palette optimized for daily use
- **Predefined Habits** - Quick start with popular habit templates
- **Long Press Actions** - Context menus for habit management

### 📊 Analytics & Insights
- **Detailed Statistics** - Current streak, best streak, total completions, completion rate
- **Multiple Views** - Switch between list, weekly grid, and yearly heatmap views
- **Progress Visualization** - Calendar dots showing completion status
- **Historical Data** - Track habits from creation date onwards

### 🔄 Data Management
- **Export/Import** - Backup and restore habits with JSON export
- **Data Persistence** - Local storage with AsyncStorage
- **Share Progress** - Share habit achievements and motivational posts
- **Cross-Device Sync** - Manual backup/restore between devices

### 🎨 Design & Accessibility
- **Clean Interface** - Minimalist design focused on daily use
- **Responsive Layout** - Optimized for various screen sizes
- **Smooth Animations** - React Native Reanimated for fluid transitions
- **Gesture Support** - React Native Gesture Handler integration

## 📱 Screenshots

<div align="center">
 <img src="https://github.com/user-attachments/assets/07f3479d-1732-425b-954f-444b07b4ee48" alt="Home Screen" width="150"/>
 <img src="https://github.com/user-attachments/assets/82f3e36e-5ba3-4e5f-a3e0-5772d5a06444" alt="Create Screen" width="150"/>
 <img src="https://github.com/user-attachments/assets/e3a9fab8-a0cc-433d-8a67-0e085f5d25be" alt="Create Habit" width="150"/>
 <img src="https://github.com/user-attachments/assets/35eb079a-9d31-424d-8e40-302c5200faa4" alt="Habit Detail" width="150"/>
 <img src="https://github.com/user-attachments/assets/8c0c854c-2917-4959-b476-9f9a4f288c07" alt="Settings" width="150"/>
</div>

<div align="center">
  <em>Home Screen • Create Habit • Habit Analytics • Settings</em>
</div>

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (Mac) or **Android Studio** (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bhavesh2k4/Lunar
   cd lunar-habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

### Development Setup

The app uses the following key technologies:

- **React Native 0.79.2** - Core framework
- **Expo SDK 53** - Development platform
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Navigation 7** - Navigation
- **React Native Reanimated 3** - Animations
- **date-fns** - Date manipulation
- **AsyncStorage** - Local data persistence

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ActionMenu.tsx   # Context menu for habit actions
│   ├── Button.tsx       # Custom button component
│   ├── CalendarView.tsx # Calendar with navigation
│   ├── DeleteModal.tsx  # Deletion confirmation
│   ├── FAB.tsx         # Floating action button
│   ├── HabitCard.tsx   # Individual habit display
│   └── ReorderableHabitList.tsx # Drag-and-drop list
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx # Stack navigator setup
├── screens/            # App screens
│   ├── CreateHabitScreen.tsx  # Habit creation
│   ├── EditHabitScreen.tsx    # Habit editing
│   ├── HabitDetailScreen.tsx  # Habit analytics
│   ├── HomeScreen.tsx         # Main dashboard
│   ├── SettingsScreen.tsx     # App settings
│   └── WidgetConfigScreen.tsx # Widget setup
├── store/              # Redux state management
│   ├── habitSlice.ts   # Habit actions/reducers
│   └── index.ts        # Store configuration
├── styles/             # Theme and styling
│   └── theme.ts        # Color and typography
├── types/              # TypeScript definitions
│   ├── habit.ts        # Habit data types
│   └── navigation.ts   # Navigation types
├── utils/              # Utility functions
│   └── HabitSharingUtils.ts # Sharing functionality
└── widgets/            # Widget implementation
    └── HabitWidget.tsx # Home screen widget
```

## 🎯 Core Components

### HabitCard
The main habit display component featuring:
- Completion toggle with visual feedback
- Streak display with fire emoji
- Swipe gestures for date navigation
- Long press for action menu
- Future date handling

### CalendarView
Interactive calendar with:
- Week-by-week navigation
- Completion visualization dots
- Swipe gestures for navigation
- Current date highlighting

### ActionMenu
Context menu providing:
- Edit habit functionality
- Share options
- Reorder mode activation
- Delete confirmation

## 📊 State Management

The app uses Redux Toolkit for state management with the following structure:

```typescript
interface HabitState {
  habits: Habit[];
}

interface Habit {
  id: string;
  name: string;
  emoji: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  completedDates: string[];
}
```

### Key Actions
- `addHabit` - Create new habit
- `editHabit` - Update habit properties
- `deleteHabit` - Remove habit
- `toggleHabitCompletion` - Mark habit complete/incomplete
- `reorderHabits` - Change habit order
- `setHabits` - Bulk update (for import)

## 🎨 Theming

The app uses a warm, minimalist color scheme:

```typescript
export const theme = {
  colors: {
    background: '#F5F3F0',  // Warm off-white
    surface: '#FFFFFF',     // Pure white
    primary: '#1A1A1A',     // Dark text
    secondary: '#6B6B6B',   // Gray text
    accent: '#4CAF50',      // Green accent
    inactive: '#B0B0B0',    // Disabled state
    border: '#E0E0E0',      // Borders
    NotToday: '#e28743',    // Orange for past dates
  },
  // ... spacing, borderRadius, typography
}
```

## 🔄 Data Flow

1. **Habit Creation** - Users create habits via CreateHabitScreen
2. **Daily Tracking** - HomeScreen displays habits for selected date
3. **Completion Toggle** - Tapping habits updates Redux store
4. **Persistence** - AsyncStorage saves data after each change
5. **Analytics** - HabitDetailScreen calculates streaks and statistics

## 📱 Platform Features

### iOS Specific
- iOS-style haptic feedback
- Native share sheet integration
- Optimized for iPhone and iPad

### Android Specific
- Edge-to-edge display support
- Android-style material design elements
- Adaptive icon support

## 🔧 Configuration

### App Configuration (app.json)
```json
{
  "expo": {
    "name": "Lunar Habit Tracker",
    "slug": "lunar-habit",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light"
  }
}
```

### Build Configuration (eas.json)
The app is configured for Expo Application Services (EAS) builds with development, preview, and production profiles.

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run on specific platform
npm run test:ios
npm run test:android
```

### Testing Strategy
- **Unit Tests** - Redux reducers and utility functions
- **Component Tests** - React Native Testing Library
- **Integration Tests** - Navigation and user flows
- **E2E Tests** - Critical user journeys

## 📦 Building for Production

### Development Build
```bash
eas build --platform all --profile development
```

### Production Build
```bash
eas build --platform all --profile production
```

### App Store Submission
```bash
eas submit --platform ios
eas submit --platform android
```

## 🔐 Data Privacy

Lunar Habit Tracker prioritizes user privacy:

- **Local Storage Only** - All data stored locally on device
- **No Analytics** - No user tracking or data collection
- **Manual Backup** - Users control their data export/import
- **No Account Required** - No sign-up or personal information needed

## 🚀 Performance Optimization

### Bundle Size
- Optimized imports to reduce bundle size
- Tree shaking for unused dependencies
- Asset optimization with Expo CLI

### Runtime Performance
- React Native Reanimated for 60fps animations
- Memoized components to prevent unnecessary re-renders
- Efficient date calculations using date-fns
- Optimized FlatList rendering for large habit lists

### Memory Management
- Proper cleanup of event listeners
- Optimized AsyncStorage usage
- Gesture handler performance optimizations

## 🔮 Future Enhancements

### Planned Features
- **Home Screen Widgets** - iOS/Android widget support
- **Cloud Sync** - Optional cloud backup
- **Advanced Analytics** - Trend analysis and insights
- **Habit Categories** - Organize habits by life areas
- **Reminder Notifications** - Smart habit reminders
- **Social Features** - Share progress with friends
- **Habit Templates** - Community-created habit packs

### Technical Improvements
- **Offline-First** - Enhanced offline capabilities
- **Performance** - Further animation optimizations
- **Accessibility** - Screen reader improvements
- **Internationalization** - Multi-language support

## 🤝 Contributing

We welcome contributions! 

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow React Native best practices
- Maintain consistent styling with existing code
- Add tests for new functionality

## 📄 License

This project is licensed under the MIT License .

## 📞 Support

### Getting Help
- **Email**: Bhavesh.oct2k4@gmail.com
- **LinkedIn**: [Bhavesh Budharaju](https://www.linkedin.com/in/bhavesh-budharaju/)
- **Issues**: Create an issue on GitHub

### Frequently Asked Questions

**Q: How do I backup my habits?**
A: Go to Settings → Export Habits to create a JSON backup file.

**Q: Can I use this app offline?**
A: Yes! All data is stored locally and the app works completely offline.

**Q: How do I restore habits on a new device?**
A: Export your habits from the old device and import the JSON file on the new device via Settings.

**Q: Why can't I mark future dates as complete?**
A: This prevents cheating and maintains the integrity of your habit tracking.

## 🙏 Acknowledgments

- **React Native Community** - For the amazing framework
- **Expo Team** - For the development platform
- **Date-fns** - For robust date manipulation
- **Redux Toolkit** - For elegant state management
- **Design Inspiration** - Modern habit tracking apps

---

*Made with 💜 for habit builders everywhere*

**⭐ If you find Lunar useful, please consider giving it a star on GitHub!**
