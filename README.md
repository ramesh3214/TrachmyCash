# TrackMyCash

A modern React Native (Expo) app to track expenses, manage income, and visualize financial data with a clean and intuitive interface.

---

## Overview

TrackMyCash helps users:
- Manage daily transactions  
- Monitor income vs expenses  
- Visualize financial data using charts  
- Use light and dark modes for better experience  

---

## Features

- Add and manage transactions  
- Real-time balance tracking  
- Donut chart (Income vs Expense)  
- Weekly spending analytics  
- Dark and Light mode support  
- Smooth navigation with gestures  

---

## Demo (APK)

Watch the demo video:  
https://drive.google.com/file/d/1gCoz_cFCoE91na0b3Z4iz1JnA_WpGbNB/view?usp=sharing

---

## Tech Stack

- React Native (Expo)  
- React Navigation (Native Stack)  
- Context API  
- SVG Charts  

---

## Prerequisites

- Node.js (v16 or higher)  
- npm or yarn  
- Expo Go app  

---

## Installation & Setup

### Clone the repository
git clone https://github.com/ramesh3214/TrachmyCash.git

### Navigate to the project
cd TrachmyCash

### Install dependencies
npm install

### Install Expo dependencies
npx expo install

---

## Run the App

npx expo start

- Scan the QR code using Expo Go  
- Or run on an emulator  

---

## Run on Android Emulator

npx expo start

Then press:
a

---

## Build APK (EAS)

npm install -g eas-cli  
eas login  
eas build:configure  
eas build -p android --profile preview  

---

## Project Structure

components/
├── AddTransaction/  
├── ContextAPI/  
├── Home/  
├── NavigationButton/  
├── SummaryPage/  

---

## Useful Commands

npx expo start -c  
npx expo-doctor  
eas build -p android  
