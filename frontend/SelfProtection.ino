#include <SoftwareSerial.h>
#include <EtherCard.h> 

// GPS 모듈 핀 설정
SoftwareSerial gpsSerial(10, 3);

//녹음 모듈 핀 설정
int REC = 7;
int PLAYE = 9;
char input = 0;

//버튼 핀 설정
const int buttonPin = 2;

//led 및 피에조 스피커 핀 설정
int ledPin = 4;
int buzzer = 5;

char c = ""; 
String str = ""; .
String targetStr = "GPGGA"; 

//이더넷 통신 모듈 설정
static byte mymac[] = {0x24,0xF5,0xAA,0xE2,0x21,0x1F};

byte Ethernet::buffer[700];
static uint32_t timer;

//클라이언트 요청 완료시 호출되는 콜백함수
static void my_callback (byte status, word off, word len) {
  Serial.println(">>>");
  Ethernet::buffer[off+300] = 0;
  Serial.print((const char*) Ethernet::buffer + off);
  Serial.println("success");
}
 
 
void setup() {
// 아두이노 센서 값 출력하는 serial
  Serial.begin(9600);
  pinMode(REC, OUTPUT);
  pinMode(PLAYE, OUTPUT);
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzer, OUTPUT);
  Serial.println("Start GPS... ");
  digitalWrite(ledPin, LOW);
  gpsSerial.begin(9600);

// 아두이노 통신 결과 출력하는 serial
  Serial.begin(57600);
  Serial.print("MAC: ");
  for(byte i = 0; i<6; ++i) {
    Serial.print(mymac[i], HEX);
    if(i<5)
      Serial.print(':');
   }
  Serial.println();

  if (ether.begin(sizeof Ethernet::buffer, mymac) == 0) 
    Serial.println(F("Failed to access Ethernet controller"));
  if (!ether.dhcpSetup())
    Serial.println(F("DHCP failed"));

  ether.printIp("IP:  ", ether.myip);
  ether.printIp("GW:  ", ether.gwip);  
  ether.printIp("DNS: ", ether.dnsip);  
  ether.printIp("SRV: ", ether.hisip);
}

void loop() {

  double lat1;
  float long1;
  int btnState = digitalRead(buttonPin);

// GPS 센서 수신후 데이터 처리
  if (gpsSerial.available()) 
  {
    c = gpsSerial.read(); // 센서의 값 읽기
    if (c == '\n') { 
      // \n 일시. 지금까지 저장된 str 값이 targetStr과 맞는지 구분
      if (targetStr.equals(str.substring(1, 6))) {
        // NMEA 의 GPGGA 값일시
        Serial.println(str);
        
        // ,를 기준으로 파싱.
        int first = str.indexOf(",");
        int two = str.indexOf(",", first + 1);
        int three = str.indexOf(",", two + 1);
        int four = str.indexOf(",", three + 1);
        int five = str.indexOf(",", four + 1);
        
        // Lat과 Long 위치에 있는 값들을 index로 추출
        String Lat = str.substring(two + 1, three);
        String Long = str.substring(four + 1, five);
        
        // Lat의 앞값과 뒷값을 구분
        String Lat1 = Lat.substring(0, 2);
        String Lat2 = Lat.substring(2);
        
        // Long의 앞값과 뒷값을 구분
        String Long1 = Long.substring(0, 3);
        String Long2 = Long.substring(3);
        
        // 좌표 계산.
        double LatF = Lat1.toDouble() + Lat2.toDouble() / 60;
        float LongF = Long1.toFloat() + Long2.toFloat() / 60;
        
        // 좌표 출력.
        Serial.print("Lat : ");
        Serial.println(LatF, 15);
        Serial.print("Long : ");
        Serial.println(LongF, 15);

        lat1=LatF;
        long1=LongF;
      }
      str = "";
    } else { 
      str += c;
    }
  }

  if (Serial.available()) {
    // 시리얼 창을 통해 입력된 값을 읽음
    input = Serial.read();
    switch (input) {
      // 시리얼 창 R 입력 시 녹음 시작
      case 'R':
        digitalWrite(REC, HIGH);
        break;
      // 시리얼 창 S 입력 시 녹음 종료
      case 'S':
        digitalWrite(REC, LOW);
        break;
      // 시리얼 창 P 입력 시 녹음된 음성 재생
      // PLAYE 기능을 사용하기 때문에 잠깐 HIGH 값 입력 후 LOW 값 입력
      case 'P':
        digitalWrite(PLAYE, HIGH);
        delay(10);
        digitalWrite(PLAYE, LOW);
        break;
    }
  }

  if (btnState == LOW) {
    ether.packetLoop(ether.packetReceive());
    char latitude = lat1;
    char longitude = long1;

    char url[100] = "latitude=";
    strcat(url, latitude);
    strcat(url, "&longitude=");
    strcat(url, longitude);
  
    if (millis() > timer) {
      timer = millis() + 5000;
      Serial.println();
      Serial.print("<<< REQ ");
      ether.browseUrl(PSTR("/axios-location?"), url, "192.168.108.152", my_callback);
    }

    Serial.println("gps 전송 완료");
    Serial.print("위도 : ");
    Serial.println(lat1, 6);
    Serial.print(" / 경도 : ");
    Serial.println(long1, 6);

    // 버튼 눌렀을 때 부저 울리고, LED 작동
    for (int i = 0; i < 15; i++) {
      digitalWrite(ledPin, HIGH);
      tone (buzzer, 3951, 400);
      delay(100);
      digitalWrite(ledPin, LOW);
      tone (buzzer, 4186, 400);
      delay(100);
    }
  }
}
