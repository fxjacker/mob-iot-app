// 하단 탭 네비게이션 구성 (홈 / 알림 / 신고 / 설정)
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false, // 상단 헤더 숨김
                tabBarActiveTintColor: "#007AFF", // 선택된 탭 색상
                tabBarInactiveTintColor: "gray", // 비활성화 탭 색상

                // 각 탭별 아이콘 설정
                tabBarIcon: ({ color, size }) => {
                    let iconName = "home";

                    if (route.name === "home") iconName = "home";
                    else if (route.name === "alert") iconName = "notifications";
                    else if (route.name === "report") iconName = "alert-circle";
                    else if (route.name === "settings") iconName = "settings";

                    return <Ionicons name={iconName as any} size={size} color={color} />;
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
