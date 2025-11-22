import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, Platform, SafeAreaView, StatusBar } from "react-native"; // StatusBar 추가
import MapView, { Circle, Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useTrafficStore } from "../src/store/useTrafficStore";
import useBleListener from "../src/hooks/useBleListener";

type EventType = "사고" | "공사" | "행사" | "정체" | string;

export default function Home() {
  useBleListener();

  const reports = useTrafficStore((s) => s.reports);
  const events = useTrafficStore((s) => s.events);

  const [region, setRegion] = useState<Region>({
    latitude: 37.554722,
    longitude: 126.970833,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // 사용자 현재 위치 초기화
  useEffect(() => {
    const initLocation = async () => {
      // 웹이 아닐 때만 권한 요청
      if (Platform.OS !== "web") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("위치 권한 거부됨"); // 사용자에게 알림 필요
          return;
        }
        
        try {
          const loc = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        } catch (error) {
          console.error("위치 가져오기 실패:", error);
        }
      }
    };
    initLocation();
  }, []);

  // 신고 데이터 Circle용 변환
  const reportCircles = useMemo(() => {
    return reports.map((r) => ({
      id: r.id,
      latitude: r.latitude,
      longitude: r.longitude,
      type: r.type, // Marker 타이틀용으로 추가
      description: r.description, // Marker 설명용으로 추가
      color:
        r.type === "사고"
          ? "rgba(255, 59, 48, 0.4)" // iOS Red
          : r.type === "공사"
          ? "rgba(255, 149, 0, 0.4)" // iOS Orange
          : "rgba(0, 122, 255, 0.4)", // iOS Blue
    }));
  }, [reports]);

  // 지도 확대 정도에 따른 동적 반경
  const dynamicRadius = useMemo(() => {
    if (region.latitudeDelta < 0.01) return 40;
    if (region.latitudeDelta < 0.05) return 120;
    if (region.latitudeDelta < 0.1) return 300;
    return 500;
  }, [region.latitudeDelta]);

  const getIconName = (type: EventType) => {
    switch (type) {
      case "사고": return "alert-circle";
      case "공사": return "construct";
      case "행사": return "calendar";
      default: return "information-circle";
    }
  };

  const getIconColor = (type: EventType) => {
    switch (type) {
      case "사고": return "#FF3B30";
      case "공사": return "#FF9500";
      case "행사": return "#007AFF";
      default: return "#8E8E93"; // 회색 (기타)
    }
  };

  return (
    // 1. SafeAreaView로 상단 노치 영역 보호
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        // 4. 성능 최적화를 위해 onRegionChangeComplete 사용 (드래그 중 렌더링 방지)
        onRegionChangeComplete={(rgn) => setRegion(rgn)}
      >
        {/* BLE 감지 이벤트 */}
        {events.map((ev) => (
          <Marker
            key={`event-${ev.id || ev.latitude}`} // 3. 고유 ID 사용 권장
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
          <React.Fragment key={`report-${r.id}`}>
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

      {/* 🔹 지도 상단 오버레이 */}
      <View style={styles.overlayContainer}>
        {/* 왼쪽: 범례 박스 (2. 로직과 텍스트 일치) */}
        <View style={styles.legendBox}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FF3B30" }]} />
            <Text style={styles.legendText}>사고</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FF9500" }]} />
            <Text style={styles.legendText}>공사</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#007AFF" }]} />
            <Text style={styles.legendText}>행사/기타</Text>
          </View>
        </View>

        {/* 오른쪽: 사건 개수 카드 */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={18} color="#007AFF" />
          <Text style={styles.infoText}>
            주변 {reports.length + events.length}건
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Android와 iOS StatusBar 높이 고려 안해도 되게끔 처리 (MapView가 전체를 덮고 오버레이만 조정)
  },
  map: {
    flex: 1,
  },
  overlayContainer: {
    position: "absolute",
    // SafeAreaView를 안 쓸 경우, 모바일 상태바 높이를 고려해 top을 넉넉히 줌
    // Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50 정도가 안전
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 60, 
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10, // 지도 위에 확실히 뜨도록
  },
  legendBox: {
    backgroundColor: "rgba(255, 255, 255, 0.95)", // 약간의 투명도 추가
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3, // 터치 영역 고려 간격 조정
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20, // 캡슐 형태로 변경 (더 깔끔함)
    paddingVertical: 8,
    paddingHorizontal: 14,
    height: 40, // 높이 고정으로 정렬 맞춤
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 6,
  },
});