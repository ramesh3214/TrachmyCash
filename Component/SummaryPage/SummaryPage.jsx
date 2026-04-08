
import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { TransactionContext } from "../Contextapi/Transectioncontext";
import { useTheme } from "../Contextapi/ThemeContext";
import BalanceCard from "./Layouts/BalanceCard";
import DonutChart from "./Layouts/DonutChart";
import TransactionList from "./Layouts/TransactionList";

const { width } = Dimensions.get("window");

const GRADIENTS = {
  success: ["#10B981", "#34D399"],
  danger: ["#EF4444", "#F87171"],
};

function Summary() {
  const { transactions, balance } = useContext(TransactionContext);
  const { theme, isDarkMode } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const transactionDate = new Date(item.date);
      if (selectedPeriod === "monthly") {
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      } else {
        return transactionDate.getFullYear() === currentYear;
      }
    });
  }, [transactions, selectedPeriod, currentMonth, currentYear]);

  const metrics = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const remainingBalance = totalIncome - totalExpense;
    const totalMoneyFlow = totalIncome + totalExpense;
    const savingsRate =
      totalIncome > 0 ? (remainingBalance / totalIncome) * 100 : 0;
    const averageTransaction =
      filteredTransactions.length > 0
        ? totalMoneyFlow / filteredTransactions.length
        : 0;

    const weeklyData = [12500, 8900, 15600, 7200, 18400, 11200, 9800];

    return {
      totalIncome,
      totalExpense,
      balance,
      remainingBalance,
      savingsRate,
      averageTransaction,
      totalMoneyFlow,
      weeklyData,
    };
  }, [filteredTransactions, balance]);

  const periodName = currentDate.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 10000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const GradientStatCard = ({
    title,
    amount,
    gradient,
    icon,
    trend,
    subtitle,
  }) => (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.statCardInner,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View style={styles.statHeader}>
          <View
            style={[styles.statIcon, { backgroundColor: gradient[0] + "20" }]}
          >
            {icon}
          </View>
          <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
            {title}
          </Text>
        </View>

        <Text style={[styles.statAmount, { color: gradient[0] }]}>
          {formatCurrency(amount)}
        </Text>

        {subtitle && (
          <Text style={[styles.statSubtitle, { color: theme.textMuted }]}>
            {subtitle}
          </Text>
        )}

        {trend && (
          <View style={styles.trendContainer}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d={
                  trend > 0
                    ? "M12 4V20M12 4L8 8M12 4L16 8"
                    : "M12 20V4M12 20L8 16M12 20L16 16"
                }
                stroke={gradient[0]}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.trendText, { color: gradient[0] }]}>
              {trend > 0 ? "+" : ""}
              {trend.toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const WeeklyActivity = () => {
    const maxValue = Math.max(...metrics.weeklyData);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <Animated.View
        style={[
          styles.weeklyCard,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.weeklyTitle, { color: theme.textPrimary }]}>
          Weekly Spending
        </Text>
        <Text style={[styles.weeklySubtitle, { color: theme.textMuted }]}>
          Last 7 days activity
        </Text>

        <View style={styles.barChartContainer}>
          {metrics.weeklyData.map((value, index) => {
            const height = (value / maxValue) * 120;
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(height, 4),
                        backgroundColor: theme.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: theme.textMuted }]}>
                  {days[index]}
                </Text>
                <Text style={[styles.barValue, { color: theme.textSecondary }]}>
                  {formatCompactCurrency(value)}
                </Text>
              </View>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const PeriodSelector = () => (
    <View style={styles.periodWrapper}>
      <View style={[styles.periodSelector, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "monthly" && [
              styles.periodButtonActive,
              { backgroundColor: theme.primary },
            ],
          ]}
          onPress={() => setSelectedPeriod("monthly")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.periodText,
              selectedPeriod === "monthly"
                ? { color: theme.textPrimary }
                : { color: theme.textSecondary },
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "yearly" && [
              styles.periodButtonActive,
              { backgroundColor: theme.primary },
            ],
          ]}
          onPress={() => setSelectedPeriod("yearly")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.periodText,
              selectedPeriod === "yearly"
                ? { color: theme.textPrimary }
                : { color: theme.textSecondary },
            ]}
          >
            Yearly
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.periodDisplay, { color: theme.primary }]}>
        {periodName}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Financial
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Overview
          </Text>
        </View>

        <PeriodSelector />

        <BalanceCard
          balance={balance}
          totalIncome={metrics.totalIncome}
          totalExpense={metrics.totalExpense}
          savingsRate={metrics.savingsRate}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
          formatCurrency={formatCurrency}
          formatCompactCurrency={formatCompactCurrency}
          theme={theme}
        />

        <DonutChart
          totalIncome={metrics.totalIncome}
          totalExpense={metrics.totalExpense}
          totalMoneyFlow={metrics.totalMoneyFlow}
          formatCompactCurrency={formatCompactCurrency}
          theme={theme}
        />

        <WeeklyActivity />

        <View style={styles.statsContainer}>
          <GradientStatCard
            title="Total Income"
            amount={metrics.totalIncome}
            gradient={GRADIENTS.success}
            trend={12.5}
            subtitle="+12.5% vs last month"
            icon={
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 4V20M12 4L8 8M12 4L16 8"
                  stroke={theme.success}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            }
          />

          <GradientStatCard
            title="Total Expense"
            amount={metrics.totalExpense}
            gradient={GRADIENTS.danger}
            trend={-8.3}
            subtitle="-8.3% vs last month"
            icon={
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 4V20M12 20L8 16M12 20L16 16"
                  stroke={theme.danger}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            }
          />
        </View>

        <View
          style={[
            styles.quickStatsRow,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatLabel, { color: theme.textMuted }]}>
              Transactions
            </Text>
            <Text style={[styles.quickStatValue, { color: theme.textPrimary }]}>
              {filteredTransactions.length}
            </Text>
          </View>
          <View
            style={[styles.quickStatDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatLabel, { color: theme.textMuted }]}>
              Average
            </Text>
            <Text style={[styles.quickStatValue, { color: theme.textPrimary }]}>
              {formatCompactCurrency(metrics.averageTransaction)}
            </Text>
          </View>
          <View
            style={[styles.quickStatDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatLabel, { color: theme.textMuted }]}>
              Net Flow
            </Text>
            <Text
              style={[
                styles.quickStatValue,
                metrics.remainingBalance >= 0
                  ? { color: theme.success }
                  : { color: theme.danger },
              ]}
            >
              {formatCompactCurrency(metrics.remainingBalance)}
            </Text>
          </View>
        </View>

        <TransactionList
          transactions={filteredTransactions}
          formatDate={formatDate}
          formatTime={formatTime}
          formatCompactCurrency={formatCompactCurrency}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          theme={theme}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 4,
  },
  periodWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 4,
    marginBottom: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  periodButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
  },
  periodDisplay: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  weeklyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  weeklySubtitle: {
    fontSize: 12,
    marginBottom: 20,
  },
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 10,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  barColumn: {
    height: 130,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  bar: {
    width: 30,
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 11,
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
  },
  statCardInner: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  statTitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  statAmount: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statSubtitle: {
    fontSize: 10,
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "600",
  },
  quickStatsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  quickStat: {
    flex: 1,
    alignItems: "center",
  },
  quickStatLabel: {
    fontSize: 11,
    marginBottom: 6,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  quickStatDivider: {
    width: 1,
  },
  bottomPadding: {
    height: 40,
  },
});

export default Summary;
