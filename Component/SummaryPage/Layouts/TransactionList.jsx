// components/Layouts/TransactionList.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const TransactionItem = ({ item, formatDate, formatTime, formatCompactCurrency, fadeAnim, slideAnim, theme }) => (
  <Animated.View
    style={[
      styles.transactionCard,
      {
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      },
    ]}
  >
    <View style={[styles.transactionCardInner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            {
              backgroundColor: item.type === "income" 
                ? theme.success + "15" 
                : theme.danger + "15",
            },
          ]}
        >
          {item.type === "income" ? (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 4V20M12 4L8 8M12 4L16 8"
                stroke={theme.success}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 4V20M12 20L8 16M12 20L16 16"
                stroke={theme.danger}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionNotes, { color: theme.textPrimary }]}>
            {item.notes || (item.type === "income" ? "Income Added" : "Payment Made")}
          </Text>
          <View style={styles.transactionMeta}>
            <Text style={[styles.transactionDate, { color: theme.textMuted }]}>{formatDate(item.date)}</Text>
            <Text style={[styles.transactionTime, { color: theme.textMuted }]}> • {formatTime(item.date)}</Text>
          </View>
        </View>
      </View>
      
      <Text
        style={[
          styles.transactionAmount,
          item.type === "income" ? { color: theme.success } : { color: theme.danger },
        ]}
      >
        {item.type === "income" ? "+" : "-"}{formatCompactCurrency(item.amount)}
      </Text>
    </View>
  </Animated.View>
);

const TransactionList = ({ transactions, formatDate, formatTime, formatCompactCurrency, fadeAnim, slideAnim, theme }) => {
  if (transactions.length === 0) {
    return (
      <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke={theme.primary}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={[styles.emptyStateTitle, { color: theme.textPrimary }]}>No Transactions</Text>
        <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
          Start adding transactions to see your financial journey
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.transactionsSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Activity</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>

      {transactions.slice(0, 5).map((item) => (
        <TransactionItem 
          key={item.id} 
          item={item} 
          formatDate={formatDate}
          formatTime={formatTime}
          formatCompactCurrency={formatCompactCurrency}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          theme={theme}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  transactionsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionCardInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionNotes: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 11,
  },
  transactionTime: {
    fontSize: 11,
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default TransactionList;