import { create } from "zustand";

export type TrafficEvent = {
    id: string;             // 고유 ID
    type: string;           // 이벤트 종류 (사고 / 공사 / 행사)
    description: string;    // 상세 설명
    locationText: string;   // 위치 설명 (주소)
    latitude: number;       // 위도
    longitude: number;      // 경도
    timestamp: number;      // 생성 시간
    source: "user" | "ble"; // 데이터 출처
};

type TrafficStore = {
    events: TrafficEvent[];   // BLE 이벤트 목록
    reports: TrafficEvent[];  // 사용자 신고 목록 (지도 Circle 표시용)
    addEvent: (event: Omit<TrafficEvent, "id" | "timestamp">) => void;
    addReport: (event: Omit<TrafficEvent, "id" | "timestamp">) => void;
    clearAll: () => void;
};

export const useTrafficStore = create<TrafficStore>((set) => ({
    events: [],
    reports: [],

    // BLE 감지 이벤트 추가
    addEvent: (eventData) =>
        set((state) => {
            const timestamp = Date.now();
            const newEvent: TrafficEvent = {
                ...eventData,
                id: `${Math.random().toString(36).slice(2)}_${timestamp}`, // ← timestamp 추가
                timestamp,
            };
            return { events: [newEvent, ...state.events] };
        }),

    // 사용자 신고 추가 (지도에 Circle 표시)
    addReport: (eventData) =>
        set((state) => {
            const timestamp = Date.now();
            const newReport: TrafficEvent = {
                ...eventData,
                id: `${Math.random().toString(36).slice(2)}_${timestamp}`, // ← timestamp 추가
                timestamp,
            };
            return { reports: [newReport, ...state.reports] };
        }),

    // 전체 초기화
    clearAll: () => set({ events: [], reports: [] }),
}));
