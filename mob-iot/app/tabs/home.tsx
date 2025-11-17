// 홈 화면: BLE 이벤트 + 사용자 신고 지도 표시 (상단 UI 추가 포함)
import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useTrafficStore } from "../src/store/useTrafficStore";
import useBleListener from "../src/hooks/useBleListener";
type EventType = "사고" | "공사" | "행사" | "정체" | string;


export default function Home() {
  useBleListener();

  const reports = useTrafficStore((s) => s.reports);
  const events = useTrafficStore((s) => s.events);

  const [region, setRegion] = useState({
    latitude: 37.554722,
    longitude: 126.970833,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // 사용자 현재 위치 초기화
  useEffect(() => {
    const initLocation = async () => {
      if (Platform.OS === "web") return;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };
    initLocation();
  }, []);

  // 신고 데이터 Circle용 변환
  const reportCircles = useMemo(() => {
    return reports.map((r) => ({
      id: r.id,
      latitude: r.latitude,
      longitude: r.longitude,
      color:
        r.type === "사고"
          ? "rgba(255,0,0,0.4)"
          : r.type === "공사"
          ? "rgba(255,165,0,0.4)"
          : "rgba(0,0,255,0.4)",
    }));
  }, [reports]);

  // 지도 확대 정도에 따른 동적 반경
  const dynamicRadius = useMemo(() => {
    if (region.latitudeDelta < 0.01) return 40;
    if (region.latitudeDelta < 0.05) return 120;
    if (region.latitudeDelta < 0.1) return 300;
    return 500;
  }, [region.latitudeDelta]);

  // 유형별 아이콘 및 색상
  const getIconName = (type: EventType) => {
    switch (type) {
      case "사고":
        return "alert-circle";
      case "공사":
        return "construct";
      case "행사":
        return "calendar";
      default:
        return "information-circle";
    }
  };

  const getIconColor = (type: EventType) => {
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        onRegionChangeComplete={(rgn) => setRegion(rgn)}
      >
        {/* BLE 감지 이벤트 */}
        {events.map((ev, idx) => (
          <Marker
            key={`event-${idx}`}
            coordinate={{
              latitude: ev.latitude,
              longitude: ev.longitude,
            }}
            title={ev.type}
            description={ev.description || ev.locationText}
          >
            <Ionicons
              name={getIconName(ev.type)}
              size={28}
              color={getIconColor(ev.type)}
            />
          </Marker>
        ))}

        {/* 사용자 신고 표시 */}
        {reportCircles.map((r) => (
          <React.Fragment key={r.id}>
            <Circle
              center={{ latitude: r.latitude, longitude: r.longitude }}
              radius={dynamicRadius}
              strokeColor={r.color}
              fillColor={r.color}
            />
            <Marker
              coordinate={{
                latitude: r.latitude,
                longitude: r.longitude,
              }}
              title={r.type}
              description={r.description}
            >
              <Ionicons
                name={getIconName(r.type)}
                size={30}
                color={getIconColor(r.type)}
              />
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      {/* 🔹 지도 상단 오버레이 (범례 + 사건 수) */}
      <View style={styles.overlayContainer}>
        {/* 왼쪽: 범례 박스 */}
        <View style={styles.legendBox}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FF3B30" }]} />
            <Text style={styles.legendText}>심각</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FF9500" }]} />
            <Text style={styles.legendText}>보통</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FFD60A" }]} />
            <Text style={styles.legendText}>경미</Text>
          </View>
        </View>

        {/* 오른쪽: 사건 개수 카드 */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={18} color="#007AFF" />
          <Text style={styles.infoText}>
            현재 {reports.length + events.length}건의 사건
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  map: {
    flex: 1,
  },
  overlayContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  legendBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: "#333",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  infoText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 6,
  },
});
