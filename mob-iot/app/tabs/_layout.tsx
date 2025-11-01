import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0066FF",
        tabBarInactiveTintColor: "#A0A0A0",
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 5 },
        tabBarIcon: ({ focused, color }) => {
          let iconName: any = "";

          if (route.name === "home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "alert") iconName = focused ? "notifications" : "notifications-outline";
          else if (route.name === "report") iconName = focused ? "alert-circle" : "alert-circle-outline";
          else if (route.name === "settings") iconName = focused ? "settings" : "settings-outline";

          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "홈" }} />
      <Tabs.Screen name="alert" options={{ title: "알림" }} />
      <Tabs.Screen name="report" options={{ title: "신고" }} />
      <Tabs.Screen name="settings" options={{ title: "설정" }} />
    </Tabs>
  );
}
