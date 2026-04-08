// components/Layouts/BalanceCard.js
import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Path, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";

const BalanceCard = ({ balance, totalIncome, totalExpense, savingsRate, fadeAnim, scaleAnim, formatCurrency, formatCompactCurrency, theme }) => {
  return (
    <Animated.View
      style={[
        styles.balanceCardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <SvgGradient id="balanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.gradientStart} />
            <Stop offset="100%" stopColor={theme.gradientEnd} />
          </SvgGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx="28" fill="url(#balanceGrad)" />
      </Svg>
      
      <View style={styles.balanceCardContent}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        
        <View style={styles.balanceStatsRow}>
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Income (This Period)</Text>
            <Text style={[styles.balanceStatValue, { color: theme.success }]}>
              +{formatCompactCurrency(totalIncome)}
            </Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Expenses</Text>
            <Text style={[styles.balanceStatValue, { color: theme.danger }]}>
              -{formatCompactCurrency(totalExpense)}
            </Text>
          </View>
        </View>
        
        <View style={styles.savingsBadge}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.savingsBadgeText}>
            Savings Rate: {savingsRate.toFixed(1)}%
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  balanceCardWrapper: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceCardContent: {
    padding: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#FFFFFFCC",
    fontWeight: "500",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 44,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
    marginBottom: 20,
  },
  balanceStatsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF15",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  balanceStat: {
    flex: 1,
    alignItems: "center",
  },
  balanceStatLabel: {
    fontSize: 11,
    color: "#FFFFFFCC",
    marginBottom: 4,
  },
  balanceStatValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  balanceDivider: {
    width: 1,
    backgroundColor: "#FFFFFF30",
  },
  savingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF15",
    borderRadius: 20,
  },
  savingsBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default BalanceCard;