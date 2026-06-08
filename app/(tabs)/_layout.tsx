import { Ionicons } from "@expo/vector-icons";
import { QueryClient } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

const queryClient = new QueryClient();

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
          <TouchableOpacity
            /* onPress={() => console.log("menu")} */
            style={{ marginLeft: 12 }}
          >
            <Ionicons name="menu" size={24} color="#1d3b1d" />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity
            /* onPress={() => console.log("profile")} */
            style={{ marginRight: 12 }}
          >
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
          //headerTitle: "Epicuro digital",
          //tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Búsqueda",
          //headerTitle: "Búsqueda",
          //tabBarLabel: "Búsqueda",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favs"
        options={{
          title: "Favoritos",
          //headerTitle: "Favoritos",
          //tabBarLabel: "Favoritos",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
