// BLE 감지 훅 - 주변 BLE 신호를 스캔해 교통 이벤트 자동 추가
import { useEffect } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { Platform } from "react-native";
import { useTrafficStore } from "../store/useTrafficStore";

export default function useBleListener() {
    const addEvent = useTrafficStore((s) => s.addEvent);

    useEffect(() => {
        // 웹 환경에서는 BLE를 실행하지 않음
        if (Platform.OS === "web") {
            console.log("웹 환경에서는 BLE 스캔을 비활성화합니다.");
            return;
        }

        const manager = new BleManager();

        // BLE 전원 상태 감시 → 켜지면 스캔 시작
        const subscription = manager.onStateChange((state) => {
            if (state === "PoweredOn") {
                startScan();
                subscription.remove();
            }
        }, true);

        const startScan = () => {
            manager.startDeviceScan(null, null, (error, device: Device | null) => {
                if (error) {
                    console.log("스캔 오류:", error);
                    return;
                }

                // 라즈베리파이 비콘 이름 예시
                if (device?.name === "MOBIOT_BEACON") {
                    addEvent({
                        type: "사고",
                        description: "BLE 신호 감지: 강남대로 다중 추돌",
                        locationText: "강남대로 역삼역 인근",
                        latitude: 37.5001,
                        longitude: 127.0364,
                        source: "ble",
                    });
                }
            });
        };

        // 언마운트 시 스캔 종료
        return () => {
            console.log("BLE 스캔 종료");
            manager.stopDeviceScan();
        };
    }, [addEvent]);
}
