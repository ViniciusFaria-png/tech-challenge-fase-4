// src/components/layout/AppLayout.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isProfessor?: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function AppLayout({
  children,
  isAuthenticated,
  isProfessor = false,
  onLoginClick,
  onLogout,
}: AppLayoutProps) {
  return (
    <View style={styles.container}>
      <Navbar
        isAuthenticated={isAuthenticated}
        isProfessor={isProfessor}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
      />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
