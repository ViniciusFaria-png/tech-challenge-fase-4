import { AuthProvider } from "@/src/contexts/AuthProvider";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="post/[id]" />
          <Stack.Screen name="post/create" />
          <Stack.Screen name="post/edit/[id]" />
          <Stack.Screen name="login" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
