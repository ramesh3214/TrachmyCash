// components/Layouts/DonutChart.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";

const DonutChart = ({
  totalIncome = 0,
  totalExpense = 0,
  totalMoneyFlow = 0,
  formatCompactCurrency,
  theme = {},
}) => {

  const success = typeof theme.success === "string" ? theme.success : "#10B981";
  const successDark =
    typeof theme.successDark === "string" ? theme.successDark : "#059669";

  const danger = typeof theme.danger === "string" ? theme.danger : "#EF4444";
  const dangerDark =
    typeof theme.dangerDark === "string" ? theme.dangerDark : "#DC2626";

  const surfaceElevated =
    typeof theme.surfaceElevated === "string"
      ? theme.surfaceElevated
      : "#27272A";

  const textPrimary =
    typeof theme.textPrimary === "string"
      ? theme.textPrimary
      : "#FFFFFF";

  const textSecondary =
    typeof theme.textSecondary === "string"
      ? theme.textSecondary
      : "#A1A1AA";

  const textMuted =
    typeof theme.textMuted === "string"
      ? theme.textMuted
      : "#71717A";

  // Calculations
  const total = totalIncome + totalExpense;
  const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;
  const expensePercentage = total > 0 ? (totalExpense / total) * 100 : 0;

  const radius = 75;
  const center = 90;
  const incomeAngle = (incomePercentage / 100) * 360;

  //  Arc creator
  const createArcPath = (startAngle, endAngle) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <View style={styles.container}>
      <Svg width={180} height={180} viewBox="0 0 180 180">
        <Defs>
          
          <SvgGradient id="incomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={success} />
            <Stop offset="100%" stopColor={successDark} />
          </SvgGradient>

          <SvgGradient id="expenseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={danger} />
            <Stop offset="100%" stopColor={dangerDark} />
          </SvgGradient>
        </Defs>

      
        {incomePercentage > 0 && (
          <Path
            d={createArcPath(-90, -90 + incomeAngle)}
            fill="url(#incomeGradient)"
          />
        )}

        
        {expensePercentage > 0 && (
          <Path
            d={createArcPath(-90 + incomeAngle, 270)}
            fill="url(#expenseGradient)"
          />
        )}

        
        <Circle cx={center} cy={center} r={52} fill={surfaceElevated} />
      </Svg>

      
      <View style={styles.centerContent}>
        <Text style={[styles.totalText, { color: textPrimary }]}>
          {formatCompactCurrency
            ? formatCompactCurrency(totalMoneyFlow)
            : totalMoneyFlow}
        </Text>
        <Text style={[styles.labelText, { color: textMuted }]}>
          Total Flow
        </Text>
      </View>

    
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: success }]} />
          <Text style={[styles.legendText, { color: textSecondary }]}>
            Income
          </Text>
          <Text style={[styles.percent, { color: textPrimary }]}>
            {incomePercentage.toFixed(0)}%
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: danger }]} />
          <Text style={[styles.legendText, { color: textSecondary }]}>
            Expense
          </Text>
          <Text style={[styles.percent, { color: textPrimary }]}>
            {expensePercentage.toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },

  centerContent: {
    position: "absolute",
    top: 90,
    left: 90,
    transform: [{ translateX: -45 }, { translateY: -30 }],
    alignItems: "center",
  },

  totalText: {
    fontSize: 18,
    fontWeight: "700",
  },

  labelText: {
    fontSize: 11,
    marginTop: 4,
  },

  legend: {
    flexDirection: "row",
    gap: 24,
    marginTop: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    fontSize: 13,
  },

  percent: {
    fontSize: 13,
    fontWeight: "600",
  },
});