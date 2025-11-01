// 알림 화면 - 등록된 교통 이벤트 리스트 표시
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTrafficStore } from "../src/store/useTrafficStore";

export default function AlertTab() {
    const events = useTrafficStore((s) => s.events); // 전역 이벤트 가져오기

    // 이벤트 종류별 색상
    const getTypeColor = (type: string) => {
        switch (type) {
            case "사고":
                return "#FF3B30";
            case "공사":
                return "#FF9500";
            case "행사":
                return "#007AFF";
            default:
                return "#8E8E93";
        }
    };

    // 등록된 이벤트가 없을 때
    if (events.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>현재 등록된 알림이 없습니다.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>실시간 알림</Text>

            {/* 이벤트 목록 출력 */}
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.card, { borderLeftColor: getTypeColor(item.type) }]}>
                        <Text style={[styles.type, { color: getTypeColor(item.type) }]}>
                            {item.type}
                        </Text>
                        <Text style={styles.title}>{item.description}</Text>
                        <Text style={styles.location}>{item.locationText}</Text>
                        <Text style={styles.source}>
                            {item.source === "user" ? "사용자 신고" : "BLE 감지"}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    header: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#333" },
    card: {
        backgroundColor: "#F9F9F9",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 5,
    },
    type: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
    title: { fontSize: 15, color: "#333", marginBottom: 2 },
    location: { fontSize: 13, color: "#666" },
    source: { fontSize: 12, color: "#999", textAlign: "right", marginTop: 4 },
    emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    emptyText: { fontSize: 15, color: "#888" },
});
