// src/components/layout/Footer.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <MaterialIcons name="school" size={16} color="#555" />
      <Text style={styles.text}>
        © {new Date().getFullYear()} Blog EducaTech. Todos os direitos
        reservados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#f2f2f2",
    gap: 6,
  },
  text: {
    color: "#555",
    fontSize: 12,
  },
});
