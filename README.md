# TrackMyCash

A modern React Native (Expo) app to track expenses, income, and visualize financial data beautifully.

---

## Overview
TrackMyCash helps users manage daily transactions, monitor income vs expenses, and visualize financial data with charts. It also supports light and dark themes for a better user experience.

---

## Features
- Add transactions  
- Real-time balance tracking  
- Donut chart (Income vs Expense)  
- Weekly spending analytics  
- Dark / Light mode support  
- Smooth navigation with gestures  

---

## Demo(APK)
link:(https://drive.google.com/file/d/1gCoz_cFCoE91na0b3Z4iz1JnA_WpGbNB/view?usp=sharing)

---------
## Tech Stack
- React Native (Expo)
- React Navigation (Native Stack)
- Context API
- SVG Charts

---

## Prerequisites
- Node.js (16+ recommended)
- npm / yarn
- Expo Go app

---

## Setup
Install dependencies:
```bash
npm install
```

Install required Expo packages:
```bash
npx expo install
```

---

## Run App
```bash
npx expo start
```
Scan QR using Expo Go

---

##  Run on Android Emulator
```bash
npx expo start
```


---

## Build APK
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

---


## Project Structur
Component/
 ├── Addtransection/
 ├── Contextapi/
 ├── Home/
 ├── Navigationbutton/
 ├── SummaryPage/
---

## Useful Commands
```bash
npx expo start -c
npx expo-doctor
eas build -p android
```
