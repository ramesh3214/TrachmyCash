import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Updated Fintech Color Palette
export const LIGHT_THEME = {
  // Primary Brand Colors
  primary: "#3B82F6",
  primaryDark: "#2563EB",
  primaryLight: "#60A5FA",
  
  // Gradient Colors
  gradientStart: "#3B82F6",
  gradientEnd: "#8B5CF6",
  
  // Status Colors
  success: "#10B981",
  successDark: "#059669",
  danger: "#EF4444",
  dangerDark: "#DC2626",
  warning: "#F59E0B",
  info: "#3B82F6",
  
  // Background & Surface Colors
  background: "#FFFFFF",
  surface: "#F8FAFC",
  surfaceElevated: "#F1F5F9",
  cardBg: "#FFFFFF",
  
  // Border Colors
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  
  // Text Colors
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#64748B",
  textInverse: "#FFFFFF",
  
  // Icon & Image Colors
  iconBg: "#F1F5F9",
  iconPrimary: "#3B82F6",
  iconSecondary: "#64748B",
  
  // Shadow Colors
  shadowColor: "#000000",
  shadowOpacity: 0.05,
  
  // Overlay Colors
  overlay: "rgba(0,0,0,0.5)",
  overlayLight: "rgba(0,0,0,0.3)",
};

export const DARK_THEME = {
  // Primary Brand Colors (Same as light mode for brand consistency)
  primary: "#3B82F6",
  primaryDark: "#2563EB",
  primaryLight: "#60A5FA",
  
  // Gradient Colors
  gradientStart: "#3B82F6",
  gradientEnd: "#8B5CF6",
  
  // Status Colors
  success: "#10B981",
  successDark: "#059669",
  danger: "#EF4444",
  dangerDark: "#DC2626",
  warning: "#F59E0B",
  info: "#3B82F6",
  
  // Background & Surface Colors
  background: "#0A0A0A",
  surface: "#18181B",
  surfaceElevated: "#27272A",
  cardBg: "#18181B",
  
  // Border Colors
  border: "#3F3F46",
  borderLight: "#27272A",
  
  // Text Colors
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textInverse: "#0A0A0A",
  
  // Icon & Image Colors
  iconBg: "#27272A",
  iconPrimary: "#3B82F6",
  iconSecondary: "#71717A",
  
  // Shadow Colors
  shadowColor: "#000000",
  shadowOpacity: 0.3,
  
  // Overlay Colors
  overlay: "rgba(0,0,0,0.7)",
  overlayLight: "rgba(0,0,0,0.5)",
};

// Gradient presets (same for both themes)
export const GRADIENTS = {
  primary: ["#3B82F6", "#8B5CF6"],
  success: ["#10B981", "#34D399"],
  danger: ["#EF4444", "#F87171"],
  accent: ["#F59E0B", "#EF4444"],
  surface: ["#18181B", "#27272A"],
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userThemePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      await AsyncStorage.setItem('userThemePreference', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setTheme = async (mode) => {
    setIsDarkMode(mode === 'dark');
    try {
      await AsyncStorage.setItem('userThemePreference', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  const gradients = GRADIENTS;

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      theme,
      gradients,
      toggleTheme,
      setTheme,
      isLoading,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;