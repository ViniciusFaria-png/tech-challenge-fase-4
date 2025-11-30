import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#5B7C99' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => <Ionicons name="newspaper" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Gestão",
          href: user?.isProfessor ? "/(tabs)/admin" : null,
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}