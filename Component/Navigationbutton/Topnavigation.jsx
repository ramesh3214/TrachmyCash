
import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Circle } from "react-native-svg";
import { TransactionContext } from "../Contextapi/Transectioncontext";
import { useTheme } from "../Contextapi/ThemeContext";


const Topnavigation = () => {
  const navigation = useNavigation();
  const { balance } = useContext(TransactionContext);
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  const userName = "Virat Kolhi";

  const handleThemeToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: isDarkMode ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      toggleTheme();
    });
  };

  const sunRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const moonRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const sunOpacity = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  const moonOpacity = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  const sunScale = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  const moonScale = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: theme.iconBg,
                borderColor: theme.primary,
              },
            ]}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5C13.933 5 15.5 6.567 15.5 8.5Z"
                stroke={theme.primary}
                strokeWidth={1.8}
              />
              <Path
                d="M5 19C5 16.2386 7.23858 14 10 14H14C16.7614 14 19 16.2386 19 19"
                stroke={theme.primary}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={[styles.welcomeText, { color: theme.textMuted }]}>
              Welcome back!
            </Text>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>
              {userName}
            </Text>
          </View>
        </TouchableOpacity>

        
        <TouchableOpacity
          style={[
            styles.themeToggle,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={handleThemeToggle}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.themeIconContainer,
              {
                opacity: sunOpacity,
                transform: [{ rotate: sunRotate }, { scale: sunScale }],
                position: "absolute",
              },
            ]}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="12"
                cy="12"
                r="5"
                stroke={theme.primary}
                strokeWidth={1.8}
              />
              <Path
                d="M12 1V3M12 21V23M23 12H21M3 12H1M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93"
                stroke={theme.primary}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>

          <Animated.View
            style={[
              styles.themeIconContainer,
              {
                opacity: moonOpacity,
                transform: [{ rotate: moonRotate }, { scale: moonScale }],
              },
            ]}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                stroke={theme.primary}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop:10,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileTextContainer: {
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Topnavigation;