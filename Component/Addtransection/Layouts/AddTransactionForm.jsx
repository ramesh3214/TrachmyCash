import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../Contextapi/ThemeContext";

const { width } = Dimensions.get("window");

const AddTransactionForm = ({ onSubmit, onBack }) => {
  const { theme, isDarkMode } = useTheme();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [type, setType] = useState("expense");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const amountScale = useRef(new Animated.Value(1)).current;

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

  const categories = {
    expense: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"],
    income: ["Salary", "Freelance", "Investment", "Gift", "Refund", "Other"]
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAmountChange = (text) => {
    setAmount(text);
    Animated.sequence([
      Animated.timing(amountScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(amountScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    if (!amount || !category) {
      Alert.alert("Error", "Please fill amount and category");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Enter valid amount");
      return;
    }

    onSubmit({
      amount: parsedAmount,
      type,
      date,
      notes,
      category
    });
  };

  const onAndroidDateChange = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) {
      setDate(selectedDate);
      setShowTime(true);
    }
  };

  const onAndroidTimeChange = (event, selectedTime) => {
    setShowTime(false);
    if (selectedTime) {
      const updated = new Date(date);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setDate(updated);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const showDateTimePicker = () => {
    if (Platform.OS === "android") {
      setShowDate(true);
    } else {
      setTempDate(date);
      setShowDatePicker(true);
    }
  };

  const CategoryButton = ({ title }) => {
    const isSelected = category === title;
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
          isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
        ]}
        onPress={() => setCategory(title)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.categoryButtonText,
          { color: theme.textSecondary },
          isSelected && { color: theme.textPrimary },
        ]}>
          {title}
        </Text>
        {isSelected && (
          <View style={[styles.categoryCheck, { backgroundColor: theme.success }]}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 6L9 17L4 12"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}
        >
          
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={onBack} 
              style={[styles.backButton, { backgroundColor: theme.surface }]}
              activeOpacity={0.7}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 18L9 12L15 6"
                  stroke={theme.textPrimary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Add Transaction</Text>
            <View style={styles.headerRight} />
          </View>

          
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
                type === "expense" && { backgroundColor: theme.danger + "15", borderColor: theme.danger },
              ]}
              onPress={() => { setType("expense"); setCategory(""); }}
              activeOpacity={0.8}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 4V20M12 20L8 16M12 20L16 16"
                  stroke={type === "expense" ? theme.textPrimary : theme.textMuted}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={[
                styles.typeText,
                { color: theme.textMuted },
                type === "expense" && { color: theme.textPrimary }
              ]}>
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
                type === "income" && { backgroundColor: theme.success + "15", borderColor: theme.success },
              ]}
              onPress={() => { setType("income"); setCategory(""); }}
              activeOpacity={0.8}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 4V20M12 4L8 8M12 4L16 8"
                  stroke={type === "income" ? theme.textPrimary : theme.textMuted}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={[
                styles.typeText,
                { color: theme.textMuted },
                type === "income" && { color: theme.textPrimary }
              ]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

        
          <View style={[styles.amountContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.currencySymbol, { color: theme.primary }]}>₹</Text>
            <Animated.View style={{ flex: 1, transform: [{ scale: amountScale }] }}>
              <TextInput
                style={[styles.amountInput, { color: theme.textPrimary }]}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
              />
            </Animated.View>
          </View>

          
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Select Category</Text>
          <View style={styles.grid}>
            {categories[type].map((cat) => (
              <CategoryButton key={cat} title={cat} />
            ))}
          </View>

        
          <TouchableOpacity 
            style={[styles.dateTimeContainer, { backgroundColor: theme.surface, borderColor: theme.border }]} 
            onPress={showDateTimePicker}
            activeOpacity={0.7}
          >
            <View style={[styles.dateTimeIcon, { backgroundColor: theme.primary + "15" }]}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                  stroke={theme.primary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
                <Circle cx="12" cy="16" r="1" fill={theme.primary} />
                <Circle cx="16" cy="16" r="1" fill={theme.primary} />
                <Circle cx="8" cy="16" r="1" fill={theme.primary} />
              </Svg>
            </View>
            <View>
              <Text style={[styles.dateTimeLabel, { color: theme.textMuted }]}>Date & Time</Text>
              <Text style={[styles.dateTimeValue, { color: theme.textPrimary }]}>
                {formatDate(date)} • {formatTime(date)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Notes Input */}
          <View style={styles.notesContainer}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Notes (Optional)</Text>
            <TextInput
              style={[styles.notesInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="Add a note..."
              placeholderTextColor={theme.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
              <Defs>
                <LinearGradient id="submitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={type === "expense" ? theme.danger : theme.success} />
                  <Stop offset="100%" stopColor={type === "expense" ? theme.dangerDark : theme.successDark} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" rx="16" fill="url(#submitGrad)" />
            </Svg>
            <Text style={[styles.submitButtonText, { color: theme.textPrimary }]}>
              {type === "expense" ? "Add Expense" : "Add Income"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      
      {Platform.OS === "android" && showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={onAndroidDateChange}
        />
      )}

    
      {Platform.OS === "android" && showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          onChange={onAndroidTimeChange}
        />
      )}

      
      {Platform.OS === "ios" && (
        <Modal visible={showDatePicker} transparent animationType="slide">
          <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.8)" }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.surfaceElevated }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.modalCancel, { color: theme.textMuted }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Select Date & Time</Text>
                <TouchableOpacity onPress={() => {
                  setDate(tempDate);
                  setShowDatePicker(false);
                }}>
                  <Text style={[styles.modalDone, { color: theme.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display="spinner"
                onChange={onDateChange}
                textColor={theme.textPrimary}
              />
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerRight: {
    width: 40,
  },
  typeToggle: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 32,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "700",
    marginRight: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: "700",
    padding: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 40,
    borderWidth: 1,
    position: "relative",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryCheck: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  dateTimeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  dateTimeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  notesContainer: {
    marginBottom: 32,
  },
  notesInput: {
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalDone: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddTransactionForm;