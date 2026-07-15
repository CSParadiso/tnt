import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "   Epicureo digital",
        headerStyle: {
          backgroundColor: "#f5f5f5",
        },
        headerTintColor: "#1d3b1d",
        headerLeft: () => (
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <Ionicons name="menu" size={24} color="#1d3b1d" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Ionicons name="person-circle-outline" size={24} color="#1d3b1d" />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favs"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
