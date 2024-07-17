#include <Arduino.h>
#if defined(ESP8266)
#include <ESP8266WiFi.h>
#endif

#include <Firebase_ESP_Client.h>

// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

/* 1. Define the WiFi credentials */
#define WIFI_SSID "jaram"
#define WIFI_PASSWORD "Qoswlfdlsnrn"

// For the following credentials, see examples/Authentications/SignInAsUser/EmailPassword/EmailPassword.ino

/* 2. Define the API Key */
#define API_KEY "AIzaSyAHlvAPWNF4kT_yEckpEUYRrOFP_KdbikA"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://dustyzap-7d2b8-default-rtdb.firebaseio.com/" //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

/* 4. Define the user Email and password that already registered or added in your project */
#define USER_EMAIL "metamong@gmail.com"
#define USER_PASSWORD "metamong"

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
unsigned long uploadInterval = 15000;  // 15초 간격으로 데이터 업로드

int dustPin = A0;
float dustYal = 0;
float dustDensityug = 0;
float voMeasured = 0;
float calcVoltage = 0;

int ledPower = 12;
int delayTime = 280;
int delayTime2 = 40;
float offTime = 9680;

void setup() {
    Serial.begin(9600);  // 시리얼 통신 시작, 속도는 9600 baud
    pinMode(ledPower, OUTPUT);  // ledPower 핀을 출력으로 설정
    pinMode(4, OUTPUT);  // 핀 4를 출력으로 설정

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();

    Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

    /* Assign the API key (required) */
    config.api_key = API_KEY;

    /* Assign the user sign-in credentials */
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;

    /* Assign the RTDB URL (required) */
    config.database_url = DATABASE_URL;

    /* Assign the callback function for the long running token generation task */
    config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

    // Since Firebase v4.4.x, BearSSL engine was used, the SSL buffer needs to be set.
    // Large data transmission may require a larger RX buffer, otherwise connection issues or data read timeout can occur.
    fbdo.setBSSLBufferSize(2048 /* Rx buffer size in bytes from 512 - 16384 */, 1024 /* Tx buffer size in bytes from 512 - 16384 */);

    Firebase.begin(&config, &auth);

    // Comment or pass false value when WiFi reconnection will be controlled by your code or third party library e.g. WiFiManager
    Firebase.reconnectNetwork(true);
}

void loop() {
    digitalWrite(ledPower, LOW);  // LED 전원 켜기
    delayMicroseconds(delayTime);  // 지정된 시간 동안 대기
    
    dustYal = analogRead(dustPin);  // 먼지 센서 값을 읽어와 dustYal에 저장
    calcVoltage = dustYal * (5.0 / 1024);  // 센서 값으로부터 전압 계산
    
    delayMicroseconds(delayTime2);  // 지정된 시간 동안 대기
    
    digitalWrite(ledPower, HIGH);  // LED 전원 끄기
    delayMicroseconds(offTime);  // 지정된 시간 동안 대기
    
    dustDensityug = (0.17 * calcVoltage - 0.1) * 1000;  // 먼지 밀도(ug/m3) 계산
    Serial.print("Dust Density [ug/m3]: ");  // 시리얼 모니터에 출력
    Serial.print(dustDensityug);
    Serial.print("     dustYal: ");
    Serial.print(dustYal);
    Serial.print("      Voltage: ");
    Serial.print(calcVoltage);
    Serial.println();  // 다음 줄로 넘어감

    // 일정 간격으로 calcVoltage 값을 Firebase에 업로드
    if (Firebase.ready() && (millis() - sendDataPrevMillis > uploadInterval)) {
        sendDataPrevMillis = millis();

        if (Firebase.RTDB.setFloat(&fbdo, "/sensor/calcVoltage", calcVoltage)) {
            Serial.println("Firebase upload succeeded");
        } else {
            Serial.println("Firebase upload failed");
            Serial.println(fbdo.errorReason());
        }
    }

    delay(3000);  // 3초 동안 대기
}
