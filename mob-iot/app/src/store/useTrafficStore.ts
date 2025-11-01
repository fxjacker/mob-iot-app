// zustand 스토어 - 교통 이벤트 전역 관리
import { create } from "zustand";

export type TrafficEvent = {
    id: string;
    type: string;
    description: string;
    locationText: string;
    latitude: number;
    longitude: number;
    timestamp: number;
    source: "user" | "ble";
};

type TrafficStore = {
    events: TrafficEvent[];
    addEvent: (event: Omit<TrafficEvent, "id" | "timestamp">) => void;
    clearAll: () => void;
};

export const useTrafficStore = create<TrafficStore>((set) => ({
    events: [],

    // 새 교통 이벤트 추가
    addEvent: (eventData) =>
        set((state) => {
            const newEvent: TrafficEvent = {
                ...eventData,
                id: Math.random().toString(36).slice(2),
                timestamp: Date.now(),
            };
            return { events: [newEvent, ...state.events] };
        }),

    // 이벤트 전체 초기화
    clearAll: () => set({ events: [] }),
}));
