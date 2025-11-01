// 홈 화면 - 지도에서 교통 이벤트를 시각화
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useTrafficStore } from "../src/store/useTrafficStore";
import useBleListener from "../src/hooks/useBleListener";

export default function Home() {
    useBleListener(); // BLE 감지 훅 실행
    const events = useTrafficStore((s) => s.events); // 전역 교통 이벤트 목록 가져오기

    // 기본 지도 위치 (강남역 근처)
    const [region, setRegion] = useState({
        latitude: 37.4979,
        longitude: 127.0276,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    // 사용자 현재 위치 요청
    useEffect(() => {
        const initLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;
            const loc = await Location.getCurrentPositionAsync({});
            setRegion({
                ...region,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
        };
        initLocation();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>실시간 교통정보</Text>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={(r) => setRegion(r)}
            >
                {/* 교통 이벤트를 지도 마커로 표시 */}
                {events.map((ev) => (
                    <Marker
                        key={ev.id}
                        coordinate={{ latitude: ev.latitude, longitude: ev.longitude }}
                        title={`${ev.type} 발생`}
                        description={`${ev.locationText} · ${ev.description}`}
                        pinColor={ev.source === "ble" ? "#ff4444" : "#0066FF"} // BLE는 빨강, 사용자신고는 파랑
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    headerTitle: { fontSize: 16, fontWeight: "600", padding: 16 },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.8,
    },
});
