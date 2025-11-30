import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { AuthProvider } from "../src/contexts/AuthContext";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5B7C99',
    secondary: '#C17767',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="post" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}