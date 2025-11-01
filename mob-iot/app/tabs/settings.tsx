// 설정 화면 - 푸시 알림, 다크 모드 설정
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function Settings() {
    const [isPushEnabled, setPushEnabled] = useState(true); // 푸시 알림 여부
    const [isDarkMode, setDarkMode] = useState(false); // 다크 모드 여부

    return (
        <View style={styles.container}>
            <Text style={styles.title}>설정</Text>

            {/* 푸시 알림 설정 */}
            <View style={styles.row}>
                <Text>푸시 알림</Text>
                <Switch value={isPushEnabled} onValueChange={setPushEnabled} />
            </View>

            {/* 다크 모드 설정 */}
            <View style={styles.row}>
                <Text>다크 모드</Text>
                <Switch value={isDarkMode} onValueChange={setDarkMode} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
});
