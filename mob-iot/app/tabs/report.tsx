// 신고 화면 - 사용자가 교통 이벤트를 직접 등록하는 화면
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { useTrafficStore } from "../src/store/useTrafficStore";

export default function Report() {
    const addReport = useTrafficStore((s) => s.addReport);
    const [type, setType] = useState(""); // 사건 유형 (사고 / 공사 / 정체 등)
    const [locationText, setLocationText] = useState(""); // 입력 주소
    const [description, setDescription] = useState(""); // 상세 설명
    const [loading, setLoading] = useState(false); // 로딩 상태

    // 신고 버튼 클릭 시 실행
    const handleSubmit = async () => {
        if (!type || !locationText || !description) {
            Alert.alert("입력 오류", "모든 항목을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            // 주소 → 위도·경도 변환
            const geo = await Location.geocodeAsync(locationText);
            if (!geo || geo.length === 0) {
                Alert.alert("주소 오류", "입력한 주소를 찾을 수 없습니다.");
                setLoading(false);
                return;
            }

            const { latitude, longitude } = geo[0];

            // 전역 스토어에 신고 데이터 추가
            addReport({
                type,
                locationText,
                description,
                latitude,
                longitude,
                source: "user",
            });

            // 성공 메시지 및 입력 초기화
            Alert.alert("신고 완료", "신고가 정상적으로 접수되었습니다.");
            setType("");
            setLocationText("");
            setDescription("");
        } catch (error) {
            console.error("신고 처리 오류:", error);
            Alert.alert("에러", "신고 처리 중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>교통정보 신고</Text>

                <TextInput
                    placeholder="신고 유형 (사고 / 공사 / 정체)"
                    style={styles.input}
                    value={type}
                    onChangeText={setType}
                />
                <TextInput
                    placeholder="주소를 입력하세요 (예: 충주시청)"
                    style={styles.input}
                    value={locationText}
                    onChangeText={setLocationText}
                />
                <TextInput
                    placeholder="상세 설명을 입력해주세요..."
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <TouchableOpacity
                    style={[styles.button, loading && { backgroundColor: "#ccc" }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "등록 중..." : "신고하기"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    textArea: { height: 100, textAlignVertical: "top" },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
