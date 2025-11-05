// Report.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTrafficStore } from "../src/store/useTrafficStore";

export default function Report() {
  const addReport = useTrafficStore((s) => s.addReport);
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [locationText, setLocationText] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // 이미지 선택
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 신고 버튼 클릭
  const handleSubmit = async () => {
    if (!type || !locationText || !description) {
      Alert.alert("입력 오류", "모든 항목을 입력해주세요.");
      return;
    }

    try {
      const geo = await Location.geocodeAsync(locationText);
      if (!geo || geo.length === 0) {
        Alert.alert("주소 오류", "입력한 주소를 찾을 수 없습니다.");
        return;
      }

      const { latitude, longitude } = geo[0];
      addReport({
        type,
        locationText,
        description,
        latitude,
        longitude,
        source: "user",
      });

      Alert.alert("신고 완료", "신고가 정상적으로 접수되었습니다.");
      setType("");
      setSeverity("");
      setLocationText("");
      setDescription("");
      setImage(null);
    } catch (error) {
      Alert.alert("에러", "신고 처리 중 문제가 발생했습니다.");
      console.error(error);
    }
  };

  const renderTypeButton = (label: string, icon: any, color: string) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.typeButton,
        type === label && { borderColor: color, backgroundColor: `${color}15` },
      ]}
      onPress={() => setType(label)}
    >
      <Ionicons
        name={icon}
        size={24}
        color={type === label ? color : "#888"}
        style={{ marginBottom: 5 }}
      />
      <Text style={[styles.typeText, { color: type === label ? color : "#333" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSeverityButton = (label: string, color: string) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.severityButton,
        severity === label && { borderColor: color, backgroundColor: `${color}15` },
      ]}
      onPress={() => setSeverity(label)}
    >
      <Text style={[styles.severityText, { color: severity === label ? color : "#333" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>교통 정보 신고</Text>

      {/* 신고 유형 */}
      <Text style={styles.subtitle}>신고 유형</Text>
      <View style={styles.row}>
        {renderTypeButton("사고", "warning-outline", "#FF3B30")}
        {renderTypeButton("공사", "construct-outline", "#FF9500")}
        {renderTypeButton("행사", "calendar-outline", "#007AFF")}
      </View>

      {/* 심각도 */}
      <Text style={styles.subtitle}>심각도</Text>
      <View style={styles.row}>
        {renderSeverityButton("경미", "#8E8E93")}
        {renderSeverityButton("보통", "#FF9500")}
        {renderSeverityButton("심각", "#FF3B30")}
      </View>

      {/* 위치 */}
      <Text style={styles.subtitle}>위치</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={18} color="#888" style={styles.icon} />
        <TextInput
          placeholder="예: 강남대로 논현역 부근"
          style={styles.input}
          value={locationText}
          onChangeText={setLocationText}
        />
      </View>

      {/* 상세 설명 */}
      <Text style={styles.subtitle}>상세 설명</Text>
      <TextInput
        placeholder="교통 상황에 대한 자세한 설명을 입력해주세요"
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* 사진 첨부 */}
      <Text style={styles.subtitle}>사진 첨부 (선택)</Text>
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <>
            <Ionicons name="camera-outline" size={32} color="#888" />
            <Text style={{ color: "#888", marginTop: 4 }}>사진 추가하기</Text>
          </>
        )}
      </TouchableOpacity>

      {/* 제출 버튼 */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>신고하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 6,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  typeText: { fontSize: 14, fontWeight: "500" },
  severityButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  severityText: { fontSize: 14, fontWeight: "500" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  icon: { marginRight: 6 },
  input: { flex: 1, paddingVertical: 10 },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    padding: 10,
  },
  imageBox: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 10 },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 30,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
