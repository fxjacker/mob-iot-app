import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

export default function Settings() {
  // 토글 상태값들
  const [isPushEnabled, setPushEnabled] = useState(true);        // 푸시 알림
  const [isDarkMode, setDarkMode] = useState(false);             // 다크 모드
  const [accidentAlert, setAccidentAlert] = useState(true);      // 교통 사고 알림
  const [constructionAlert, setConstructionAlert] = useState(true);// 도로 공사 알림
  const [eventAlert, setEventAlert] = useState(false);           // 행사 정보 알림
  const [locationAlert, setLocationAlert] = useState(true);      // 위치 기반 알림

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>IoT 센서 연결</Text>
          <Text style={styles.description}>
            IoT 센서에 연결해야 실시간 교통 정보를 받을 수 있습니다.{"\n"}
            테스트를 위해 시뮬레이션 모드를 먼저 사용해보세요.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={() => { /* 추후 시뮬 시작 로직 */ }}>
            <Text style={styles.primaryButtonText}>시뮬레이션 모드 시작</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => { /* 추후 BLE 검색 로직 */ }}>
            <Text style={styles.secondaryButtonText}>블루투스 기기 검색</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>알림 설정</Text>

          <View style={styles.row}>
            <Text style={styles.text}>푸시 알림</Text>
            <Switch value={isPushEnabled} onValueChange={setPushEnabled} />
          </View>

          <View style={styles.subSection}>
            <Text style={[styles.text, styles.subText]}>알림 유형</Text>

            <View style={styles.row}>
              <Text style={styles.text}>교통 사고</Text>
              <Switch value={accidentAlert} onValueChange={setAccidentAlert} />
            </View>

            <View style={styles.row}>
              <Text style={styles.text}>도로 공사</Text>
              <Switch value={constructionAlert} onValueChange={setConstructionAlert} />
            </View>

            <View style={styles.row}>
              <Text style={styles.text}>행사 정보</Text>
              <Switch value={eventAlert} onValueChange={setEventAlert} />
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.text}>위치 기반 알림</Text>
            <Switch value={locationAlert} onValueChange={setLocationAlert} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>화면 설정</Text>
          <View style={styles.row}>
            <Text style={styles.text}>다크 모드</Text>
            <Switch value={isDarkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>개인정보 및 보안</Text>
          <TouchableOpacity style={styles.listButton} onPress={() => { /* 정책 화면 이동 */ }}>
            <Text style={styles.text}>개인정보 처리방침</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listButton} onPress={() => { /* 위치 권한/관리 */ }}>
            <Text style={styles.text}>위치 정보 관리</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listButton} onPress={() => { /* 데이터 삭제 플로우 */ }}>
            <Text style={styles.text}>데이터 삭제</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 스타일: 카드형 레이아웃, 토글 행, 섹션 구분선 등
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16, // 좌우 여백
    paddingTop: 32,        // 상단 여백
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    elevation: 2,          // Android 그림자
    shadowColor: "#000",   // iOS 그림자
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: "#1E88E5",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#1E88E5",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1E88E5",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,   // 행 높이
  },
  subSection: {
    marginVertical: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",   // 섹션 구분선
  },
  subText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  listButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 15,
    color: "#222",
  },
});
