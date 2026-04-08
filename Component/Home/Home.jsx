
import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Bottomnavigation from "../Navigationbutton/Bottomnavigation";
import SummaryPage from "../SummaryPage/SummaryPage";
import Topnavigation from "../Navigationbutton/Topnavigation";
import { useTheme } from "../Contextapi/ThemeContext";

function Home() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Topnavigation />

      <View style={styles.content}>
        <SummaryPage />
      </View>

      <View style={styles.bottomNav}>
        <Bottomnavigation />
      </View>
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});