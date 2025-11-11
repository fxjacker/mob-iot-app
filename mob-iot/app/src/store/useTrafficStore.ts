import { create } from "zustand";

// 교통 이벤트(신고/센서 공통) 데이터 구조
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

// 전역 상태 관리용 스토어 타입
type TrafficStore = {
    events: TrafficEvent[];   // BLE 감지 이벤트 목록
    reports: TrafficEvent[];  // 사용자 신고 목록
    addEvent: (event: Omit<TrafficEvent, "id" | "timestamp">) => void;
    addReport: (event: Omit<TrafficEvent, "id" | "timestamp">) => void;
    getAllEvents: () => TrafficEvent[]; // 두 목록 합쳐서 반환
    clearAll: () => void;
};

// Zustand 스토어 생성
export const useTrafficStore = create<TrafficStore>((set, get) => ({
    events: [],
    reports: [],

    // BLE 감지 이벤트 추가
    addEvent: (eventData) =>
        set((state) => {
            const timestamp = Date.now();
            const newEvent: TrafficEvent = {
                ...eventData,
                id: `${Math.random().toString(36).slice(2)}_${timestamp}`,
                timestamp,
            };
            return { events: [newEvent, ...state.events] };
        }),

    // 사용자 신고 추가
    addReport: (eventData) =>
        set((state) => {
            const timestamp = Date.now();
            const newReport: TrafficEvent = {
                ...eventData,
                id: `${Math.random().toString(36).slice(2)}_${timestamp}`,
                timestamp,
            };
            return { reports: [newReport, ...state.reports] };
        }),

    // BLE + 신고 데이터 모두 가져오기
    getAllEvents: () => {
        const { events, reports } = get();
        return [...events, ...reports];
    },

    // 모든 데이터 초기화
    clearAll: () => set({ events: [], reports: [] }),
}));

