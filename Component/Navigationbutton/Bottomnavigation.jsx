
import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Svg, { Path, Circle, LinearGradient, Stop, Defs, Rect } from "react-native-svg";
import { useTheme } from "../Contextapi/ThemeContext";

function Bottomnavigation() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;
  const { theme } = useTheme();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const addRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAddPress = () => {
    Animated.sequence([
      Animated.timing(addRotate, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(addRotate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate("AddTransaction");
  };

  const addRotateInterpolate = addRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const NavItem = ({ screen, icon, label, isActive }) => (
    <TouchableOpacity
      style={styles.navItem}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
        {icon(isActive ? theme.primary : theme.textMuted)}
      </View>
      <Text
        style={[
          styles.label,
          { color: isActive ? theme.primary : theme.textMuted },
        ]}
      >
        {label}
      </Text>
      {isActive && <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />}
    </TouchableOpacity>
  );

  const HomeIcon = (color) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12L5 10M5 10L12 3L19 10M5 10V20H9V16C9 14.8954 9.89543 14 11 14H13C14.1046 14 15 14.8954 15 16V20H19V10M19 10L21 12"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const ProfileIcon = (color) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 8.5C15.5 10.433 13.933 12 12 12C10.067 12 8.5 10.433 8.5 8.5C8.5 6.567 10.067 5 12 5C13.933 5 15.5 6.567 15.5 8.5Z"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path
        d="M5 19C5 16.2386 7.23858 14 10 14H14C16.7614 14 19 16.2386 19 19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );

  const AddIcon = () => (
    <Animated.View style={{ transform: [{ rotate: addRotateInterpolate }] }}>
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 5V19M5 12H19"
          stroke="#FFFFFF"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
      ]}
    >
      <NavItem
        screen="Home"
        icon={HomeIcon}
        label="Home"
        isActive={currentRoute === "Home"}
      />

      <View style={styles.centerButtonWrapper}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={handleAddPress}
            activeOpacity={0.8}
          >
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
              <Defs>
                <LinearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={theme.gradientStart} />
                  <Stop offset="100%" stopColor={theme.gradientEnd} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="64" height="64" rx="32" fill="url(#centerGrad)" />
            </Svg>
            <View style={styles.centerButtonInner}>
              <AddIcon />
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Text style={[styles.centerLabel, { color: theme.primary }]}>Add</Text>
      </View>

      <NavItem
        screen="Profile"
        icon={ProfileIcon}
        label="Profile"
        isActive={currentRoute === "Profile"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopWidth: 1,
  },

  navItem: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },

  iconWrapper: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 4,
  },

  iconWrapperActive: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },

  label: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: 0.3,
  },

  activeDot: {
    position: "absolute",
    top: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  centerButtonWrapper: {
    alignItems: "center",
    marginHorizontal: 16,
  },

  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -32,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    overflow: "hidden",
  },

  centerButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  centerLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
    letterSpacing: 0.3,
  },
});

export default Bottomnavigation;