// src/components/layout/Navbar.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NavbarProps {
  isAuthenticated: boolean;
  isProfessor?: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Navbar({
  isAuthenticated,
  isProfessor = false,
  onLoginClick,
  onLogout,
}: NavbarProps) {
  const handleAddPost = () => router.push("/post/create");

  return (
    <View style={styles.navbar}>
      <View style={styles.logoArea}>
        <MaterialIcons name="school" size={22} color="#fff" />
        <Text style={styles.title}>Blog EducaTech</Text>
      </View>

      <View style={styles.actions}>
        {isAuthenticated ? (
          <>
            {isProfessor && (
              <TouchableOpacity onPress={handleAddPost} style={styles.button}>
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onLogout} style={styles.button}>
              <MaterialIcons name="logout" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={onLoginClick} style={styles.button}>
            <MaterialIcons name="login" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    padding: 6,
  },
});
