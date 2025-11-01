// 신고 화면 - 사용자가 교통 이벤트를 직접 등록
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useTrafficStore } from "../src/store/useTrafficStore";

export default function Report() {
    const addEvent = useTrafficStore((s) => s.addEvent); // 전역 스토어에 이벤트 추가 함수
    const [type, setType] = useState("");
    const [locationText, setLocationText] = useState("");
    const [description, setDescription] = useState("");

    // 신고 버튼 클릭 시 실행
    const handleSubmit = () => {
        if (!type || !locationText || !description) {
            Alert.alert("입력 오류", "모든 항목을 입력해주세요.");
            return;
        }

        // 새로운 이벤트 추가 (기본 위치는 강남역 근처)
        addEvent({
            type,
            locationText,
            description,
            latitude: 37.4979,
            longitude: 127.0276,
            source: "user",
        });

        Alert.alert("신고 완료", "신고가 접수되었습니다.");
        setType("");
        setLocationText("");
        setDescription("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>교통정보 신고</Text>

            {/* 입력 폼 */}
            <TextInput
                placeholder="신고 유형 (사고 / 공사 / 행사)"
                style={styles.input}
                value={type}
                onChangeText={setType}
            />
            <TextInput
                placeholder="위치 (예: 강남대로 역삼역 인근)"
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

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>신고하기</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
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
