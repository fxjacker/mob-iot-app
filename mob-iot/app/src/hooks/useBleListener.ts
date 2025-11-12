import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { Buffer } from "buffer";
import { useTrafficStore } from "../store/useTrafficStore";


// BLE 헤더 코드 정의
const HEADER = {
  LONGITUDE: 0x01,       // 경도
  LATITUDE: 0x02,        // 위도
  ACCIDENT: 0x03,        // 사고 이벤트
  SIGNAL_STATE: 0x04,    // 신호등 상태 (1: GREEN, 2: YELLOW, 3: RED)
  REMAINING_TIME: 0x05,  // 신호등 잔여 시간
  SPEED: 0x06,           // 차량 속도
};

// 신호등 상태 매핑
const SIGNAL_STATE_MAP: Record<number, string> = {
  1: "GREEN",
  2: "YELLOW",
  3: "RED",
};

/**
 * BLE 감지 훅
 * - 실제 환경에서는 BLE 장치로부터 Double(8바이트) 데이터 수신
 * - 개발 환경(Expo Go, Web 등)에서는 Mock 데이터 사용
 */
export default function useBleListener() {
  const addEvent = useTrafficStore((s) => s.addEvent);
  const tempEvent = useRef<any>({});
  const managerRef = useRef<BleManager | null>(null);

  useEffect(() => {
    /**
     * 개발 / 테스트 환경일 때: Mock 데이터 사용
     * 실제 BLE가 없는 환경에서도 지도 표시 확인용
     */
    if (Platform.OS === "web" || __DEV__) {
      console.log("BLE 비활성화 환경. Mock 데이터 사용 중");
      const interval = setInterval(() => {
        const mockEvents = [
          {
            type: "accident",
            description: "Mock BLE 감지: 도로 사고 발생",
            latitude: 37.5665,
            longitude: 126.9780,
            locationText: "광화문 사거리",
            source: "ble" as const,
          },
          {
            type: "signal",
            description: "Mock BLE 감지: 신호등 RED (잔여 10초)",
            latitude: 37.5651,
            longitude: 126.9762,
            locationText: "시청 사거리",
            source: "ble" as const,
          },
        ];

        const random = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        addEvent(random);
      }, 20000);
      return () => clearInterval(interval);
    }

    /**
     * 실제 BLE 환경: 장치 스캔 후 manufacturerData 파싱
     */
    const manager = new BleManager();
    managerRef.current = manager;

    const startScan = () => {
      manager.startDeviceScan(null, null, (error, device: Device | null) => {
        if (error) {
          console.log("BLE 스캔 오류:", error);
          return;
        }

        if (device?.manufacturerData) {
          // 수신된 Base64 데이터를 Double 형태로 해석
          const parsed = parseBleData(device.manufacturerData, tempEvent.current);

          // 위도·경도 모두 수신되면 하나의 이벤트로 등록
          if (isEventReady(tempEvent.current)) {
            addEvent({
              type: detectEventType(tempEvent.current),
              description: makeDescription(tempEvent.current),
              latitude: tempEvent.current.latitude,
              longitude: tempEvent.current.longitude,
              locationText: "BLE 감지 위치",
              source: "ble",
            });
            tempEvent.current = {}; // 조립 완료 후 초기화
          }
        }
      });
    };

    const subscription = manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        console.log("BLE 전원 ON → 스캔 시작");
        startScan();
        subscription.remove();
      }
    }, true);

    return () => {
      console.log("BLE 스캔 종료");
      managerRef.current?.stopDeviceScan();
      managerRef.current?.destroy();
    };
  }, [addEvent]);
}

/**
 * Base64 → 헤더 + Double 데이터로 해석
 * 1바이트: 헤더 코드
 * 8바이트: Double 값
 */
function parseBleData(base64: string, temp: any) {
  const buffer = Buffer.from(base64, "base64");
  const view = new DataView(buffer.buffer);
  const header = view.getUint8(0);
  const value = view.getFloat64(1, true);

  switch (header) {
    case HEADER.LONGITUDE:
      temp.longitude = value;
      break;
    case HEADER.LATITUDE:
      temp.latitude = value;
      break;
    case HEADER.ACCIDENT:
      temp.isAccident = value === 1;
      break;
    case HEADER.SIGNAL_STATE:
      temp.signalState = SIGNAL_STATE_MAP[value] || "UNKNOWN";
      break;
    case HEADER.REMAINING_TIME:
      temp.remainingTime = Math.round(value);
      break;
    case HEADER.SPEED:
      temp.speed = Math.round(value);
      break;
  }
  return temp;
}

/** 위도·경도 모두 있을 때 이벤트 생성 가능 */
function isEventReady(temp: any) {
  return temp.latitude !== undefined && temp.longitude !== undefined;
}

/** 이벤트 종류 결정 */
function detectEventType(temp: any) {
  if (temp.isAccident) return "accident";
  if (temp.signalState) return "signal";
  return "traffic";
}

/** 지도에 표시할 설명 문구 자동 생성 */
function makeDescription(temp: any) {
  if (temp.isAccident) return "사고 감지됨";
  if (temp.signalState)
    return `신호등 상태: ${temp.signalState}, 잔여 ${temp.remainingTime ?? "-"}초`;
  if (temp.speed) return `차량 속도: ${temp.speed} km/h`;
  return "BLE 이벤트";
}
