# Xpensify AI 

<p align="center">
  <img src="assets/Expensify%20App%20Store%20Img.png" alt="Xpensify App Store Image" width="100%" />
</p>

**Xpensify** is a smart, AI-powered expense tracking mobile application built with React Native and Expo. It simplifies personal finance management by automatically capturing transactions (like UPI payments) and providing deep insights into your spending habits.

---

## ✨ Features

* 🤖 **AI-Powered Insights**: Smart categorization and analytics of your spending patterns.
* 📩 **SMS Expense Capture (Android)**: Automatically detects and logs UPI payments by parsing SMS notifications—no manual entry needed!
* 🔐 **Seamless Authentication**: Secure login with Google Sign-In and Firebase Authentication.
* 📊 **Comprehensive Dashboard**: View your transactions, track monthly budgets, and analyze spending through intuitive charts.
* 🗂️ **Custom Categories**: Create, edit, and organize custom income and expense categories.
* 🔔 **Smart Reminders**: Get notified about upcoming bills, weekly digests, and unusual spend alerts.
* 📱 **Cross-Platform Base**: Built with Expo and React Native, utilizing a high-performance webview-based UI layer.

## 🛠️ Tech Stack

* **Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
* **Authentication & Backend**: [Firebase](https://firebase.google.com/)
* **Local Storage**: `@react-native-async-storage/async-storage`
* **UI Architecture**: React Native WebView integration bridging to a web-based UI layer
* **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or newer recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Expo CLI](https://docs.expo.dev/more/expo-cli/)
* Android Studio (for Android emulation) or Xcode (for iOS emulation)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/xpensify.git
   cd xpensify
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Setup Environment Variables:**
   Copy the sample environment file and configure your keys.

   ```bash
   cp .env.example .env
   ```

   *Make sure to add your Google Web Client ID and Firebase configuration to `.env`.*
4. **Firebase Configuration:**

   * Set up a project on the [Firebase Console](https://console.firebase.google.com/).
   * Enable **Google Authentication**.
   * Add the `google-services.json` file for Android to the root directory.

### Running the App

* **Start the Expo development server:**
  ```bash
  npm start
  ```
* **Run on Android:**
  ```bash
  npm run android
  ```
* **Run on iOS:**
  ```bash
  npm run ios
  ```

## 📱 SMS Auto-Capture (Android Only)

Xpensify uses background services to read incoming SMS messages related to banking and UPI transactions. For this feature to work, the app requires:

* SMS Read Permissions
* Notification Access
* Display over other apps (Overlay Permission)

The app will prompt you to grant these permissions upon first login on an Android device.

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve Xpensify:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
