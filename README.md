# 🎬 DesiFlix - Node.js Android APK Application

> **Hello World Android Application powered by Node.js, Vite, Capacitor & Automated GitHub Actions CI/CD Release!**

This project demonstrates how **Node.js v24+** is used to create and compile a fully functional Android `.apk` application, and how **GitHub Actions** automatically compiles, signs, and publishes `.apk` releases!

---

## 🚀 One-Command Automated Tag & APK Release

To automatically commit, generate a version tag (`v1.0.0`), push to GitHub (`https://github.com/sabbir28/DesiFlix.git`), and trigger the GitHub Actions APK build:

```bash
npm run release
```

*This single command will stage all files, create the release commit, create the tag `v1.0.0`, push to GitHub, and trigger the automatic APK build release pipeline!*

---

## 🧐 How Node.js Builds an Android APK

1. **Node.js Toolchain (`npm` / `vite`)**: Compiles HTML5, CSS3 glassmorphic design system, and JavaScript into a high-performance web asset bundle in `dist/`.
2. **Capacitor Native Bridge (`@capacitor/android`)**: Converts the Node.js web bundle into an Android native Java/Kotlin project inside the `android/` directory.
3. **Android Gradle Compiler**: Compiles native Android code and WebView runtime into a runnable `.apk` file (`app-debug.apk` / `app-release.apk`).

---

## 🛠️ Quick Start Guide

### 1. Install Dependencies
Run in terminal inside `d:\Progect\DesiFlix`:
```bash
npm install
```

### 2. Run Local Development Web Server
To test and preview the application in your web browser:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to interact with the responsive mobile UI.

---

## 🤖 Manual Local APK Generation

### Step A: Build Web Production Assets
```bash
npm run build
```

### Step B: Initialize Android Native Project
```bash
npx cap add android
```

### Step C: Sync Web Assets to Android Project
```bash
npx cap sync android
```

### Step D: Build the `.apk` Binary File
```bash
cd android
./gradlew assembleDebug
```
The output debug APK will be created at:
📍 `android/app/build/outputs/apk/debug/app-debug.apk`

---

## ⚡ Manual Git Release Commands

If you prefer running Git commands manually:

```bash
git init
git remote add origin https://github.com/sabbir28/DesiFlix.git
git branch -M main
git add .
git commit -m "first commit"
git tag v1.0.0
git push -u origin main
git push origin v1.0.0
```

---

## 🔐 (Optional) Setting Up Signed APK Secrets in GitHub

To sign your APK with a custom production Keystore, add these Secrets in your GitHub Repo (**Settings > Secrets and variables > Actions**):

| Secret Name | Description |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Base64 string of your `.keystore` file (`base64 my-release-key.keystore`) |
| `ANDROID_KEY_ALIAS` | Alias name of your signing key |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_PASSWORD` | Key password |
