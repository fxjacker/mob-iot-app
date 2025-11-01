// src/store/useTrafficStore.ts
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
    events: TrafficEvent[];  // BLE 및 사용자 이벤트 목록
    reports: TrafficEvent[]; // ✅ 신고 목록 (Circle 표시용)
    addEvent: (event: Omit<TrafficEvent, "id" | "timestamp">) => void;
    addReport: (event: Omit<TrafficEvent, "id" | "timestamp">) => void;
    clearAll: () => void;
};

export const useTrafficStore = create<TrafficStore>((set) => ({
    events: [],
    reports: [], // ✅ 새로 추가됨

    // ✅ BLE 또는 일반 이벤트 추가
    addEvent: (eventData) =>
        set((state) => {
            const newEvent: TrafficEvent = {
                ...eventData,
                id: Math.random().toString(36).slice(2),
                timestamp: Date.now(),
            };
            return { events: [newEvent, ...state.events] };
        }),

    // ✅ 신고 이벤트 추가 (Home에서 Circle로 표시)
    addReport: (eventData) =>
        set((state) => {
            const newReport: TrafficEvent = {
                ...eventData,
                id: Math.random().toString(36).slice(2),
                timestamp: Date.now(),
            };
            return { reports: [newReport, ...state.reports] };
        }),

    // ✅ 전체 초기화
    clearAll: () => set({ events: [], reports: [] }),
}));
