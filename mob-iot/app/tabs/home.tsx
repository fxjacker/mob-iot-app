import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps"; // ✅ 이것만 쓰면 됨
import * as Location from "expo-location";
import { useTrafficStore } from "../src/store/useTrafficStore";
import useBleListener from "../src/hooks/useBleListener";

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

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {events.map((ev, idx) => (
          <Marker
            key={`event-${idx}`}
            coordinate={{
              latitude: ev.latitude,
              longitude: ev.longitude,
            }}
            title={ev.type}
            description={ev.description || ev.locationText}
          />
        ))}

        {reportCircles.map((r) => (
          <Circle
            key={r.id}
            center={{
              latitude: r.latitude,
              longitude: r.longitude,
            }}
            radius={10}
            strokeColor={r.color}
            fillColor={r.color}
          />
        ))}
      </MapView>
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
});
