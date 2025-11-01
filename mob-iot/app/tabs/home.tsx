import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useTrafficStore } from "../src/store/useTrafficStore";
import useBleListener from "../src/hooks/useBleListener";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
    useBleListener();

    const { events, reports } = useTrafficStore((s) => ({
        events: s.events,
        reports: s.reports,
    }));

    const insets = useSafeAreaInsets();

    const [initialRegion, setInitialRegion] = React.useState({
        latitude: 37.554722,
        longitude: 126.970833,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    useEffect(() => {
        const initLocation = async () => {
            if (Platform.OS === "web") return;
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;
            const loc = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
        };
        initLocation();
    }, []);

    const uniqueEvents = useMemo(() => {
        return events.filter(
            (v, i, a) =>
                a.findIndex(
                    (t) =>
                        t.latitude === v.latitude &&
                        t.longitude === v.longitude &&
                        t.type === v.type
                ) === i
        );
    }, [events]);

    if (Platform.OS === "web") {
        return (
            <View style={styles.webContainer}>
                <Text style={styles.webNotice}>
                    지도 기능은 모바일 앱에서만 사용 가능합니다.
                </Text>
            </View>
        );
    }

    const getCircleColor = (type: string) => {
        switch (type) {
            case "사고":
                return "rgba(255, 0, 0, 0.3)";
            case "공사":
                return "rgba(255, 165, 0, 0.3)";
            case "정체":
                return "rgba(0, 0, 255, 0.3)";
            default:
                return "rgba(0, 255, 0, 0.3)";
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
            <Text style={styles.headerTitle}>실시간 교통정보</Text>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {uniqueEvents.map((ev, index) => (
                    <Marker
                        key={`${ev.latitude}-${ev.longitude}-${ev.type}-${index}`}
                        coordinate={{
                            latitude: ev.latitude,
                            longitude: ev.longitude,
                        }}
                        title={`${ev.type} 발생`}
                        description={`${ev.locationText} · ${ev.description}`}
                        pinColor={ev.source === "ble" ? "#ff4444" : "#0066FF"}
                    />
                ))}

                {reports.map((r, index) => (
                    <Circle
                        key={`report-${r.latitude}-${r.longitude}-${index}`}
                        center={{
                            latitude: r.latitude,
                            longitude: r.longitude,
                        }}
                        radius={150}
                        fillColor={getCircleColor(r.type)}
                        strokeColor="rgba(0,0,0,0.2)"
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        paddingBottom: 8,
        paddingHorizontal: 16,
        zIndex: 10,
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.85,
    },
    webContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    webNotice: { fontSize: 16, color: "#555", textAlign: "center" },
});
