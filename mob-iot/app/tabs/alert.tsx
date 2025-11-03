// Alert.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTrafficStore } from "../src/store/useTrafficStore";

export default function Alert() {
  // Zustand 상태 읽기 (읽기 전용)
  const reports = useTrafficStore((s) => s.reports);
  const events = useTrafficStore((s) => s.events);

  // reports + events 합치기 (렌더링 중 새 객체를 매번 만들지 않도록 useMemo 사용)
  const allData = React.useMemo(() => {
    return [...reports, ...events].sort((a, b) => b.timestamp - a.timestamp);
  }, [reports, events]);

  // 유형별 색상
  const getTypeColor = (type: string) => {
    switch (type) {
      case "사고":
        return "#FF3B30";
      case "공사":
        return "#FF9500";
      case "정체":
        return "#007AFF";
      default:
        return "#8E8E93";
    }
  };

  // 알림이 없을 때
  if (allData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>현재 등록된 알림이 없습니다.</Text>
      </View>
    );
  }

  // 알림 목록 표시
  return (
    <View style={styles.container}>
      <Text style={styles.header}>실시간 알림</Text>
      <FlatList
        data={allData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { borderLeftColor: getTypeColor(item.type) },
            ]}
          >
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
