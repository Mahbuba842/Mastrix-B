export const FIRMWARE_FILENAME = "mastrix_b_esp32.ino";

export const FIRMWARE_CODE = `/*
 * Mastrix B — ESP32 sensor node (prototype firmware)
 * -------------------------------------------------
 * Reads milk conductivity, milk/body temperature, milk yield,
 * animal activity and shed climate, identifies the animal by RFID
 * and posts one JSON payload per milking to the Mastrix B backend.
 *
 * Board:    ESP32 DevKit v1 (240 MHz, Wi-Fi)
 * Toolchain: Arduino IDE 2.x / arduino-esp32 core 3.x
 * Libraries: OneWire, DallasTemperature, Adafruit_ADS1X15,
 *            Adafruit_MPU6050, Adafruit_BME280, HX711, MFRC522
 *
 * Prototype code for demonstration. Calibrate every probe against
 * your own herd before relying on any reading.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_BME280.h>
#include <HX711.h>
#include <MFRC522.h>
#include <SPI.h>

// ---------- configuration ----------
const char* WIFI_SSID     = "SHED_A_WIFI";
const char* WIFI_PASSWORD = "change-me";
const char* INGEST_URL    = "https://your-app.lovable.app/api/public/readings";
const char* DEVICE_ID     = "ESP32-SHED-A-01";
const uint32_t READ_INTERVAL_MS = 60000;   // one reading per minute

// ---------- pin map ----------
#define PIN_ONEWIRE     4    // DS18B20 data (4.7k pull-up to 3V3)
#define PIN_HX711_DT    16   // load cell data
#define PIN_HX711_SCK   17   // load cell clock
#define PIN_RFID_SS     5    // MFRC522 SDA/SS
#define PIN_RFID_RST    27   // MFRC522 RST
#define PIN_I2C_SDA     21   // ADS1115 + MPU6050 + BME280
#define PIN_I2C_SCL     22
#define PIN_STATUS_LED  2

OneWire oneWire(PIN_ONEWIRE);
DallasTemperature tempSensors(&oneWire);
Adafruit_ADS1115 ads;          // milk EC probe -> A0
Adafruit_MPU6050 mpu;          // activity
Adafruit_BME280 bme;           // shed temperature + humidity
HX711 scale;                   // milk yield
MFRC522 rfid(PIN_RFID_SS, PIN_RFID_RST);

// EC calibration: ecValue = EC_SLOPE * volts + EC_OFFSET  (mS/cm)
const float EC_SLOPE  = 2.15f;
const float EC_OFFSET = 0.12f;
// Load cell calibration factor from a known 5 kg weight
const float SCALE_FACTOR = 21.7f;

uint32_t lastRead = 0;
uint32_t stepCount = 0;

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  uint8_t tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries++ < 40) {
    delay(500);
    Serial.print('.');
  }
  Serial.println(WiFi.status() == WL_CONNECTED ? "\\nWi-Fi connected" : "\\nWi-Fi failed");
}

String readRfidUid() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return String("");
  String uid;
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (i) uid += ":";
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  rfid.PICC_HaltA();
  return uid;
}

float readMilkEc() {
  int16_t raw = ads.readADC_SingleEnded(0);
  float volts = ads.computeVolts(raw);
  return EC_SLOPE * volts + EC_OFFSET;   // mS/cm
}

void sampleActivity() {
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  float mag = sqrt(a.acceleration.x * a.acceleration.x +
                   a.acceleration.y * a.acceleration.y +
                   a.acceleration.z * a.acceleration.z);
  if (mag > 11.5f) stepCount++;          // simple step threshold
}

void postReading(const String& uid, float ec, float milkT, float bodyT,
                 float yieldL, float envT, float humidity) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("offline — queue reading on SD and retry later");
    return;
  }
  String body = String("{") +
    "\\"device_id\\":\\"" + DEVICE_ID + "\\"," +
    "\\"rfid_uid\\":\\"" + uid + "\\"," +
    "\\"milk_ec\\":" + String(ec, 2) + "," +
    "\\"milk_temp_c\\":" + String(milkT, 2) + "," +
    "\\"body_temp_c\\":" + String(bodyT, 2) + "," +
    "\\"milk_yield_l\\":" + String(yieldL, 2) + "," +
    "\\"activity_steps\\":" + String(stepCount) + "," +
    "\\"env_temp_c\\":" + String(envT, 1) + "," +
    "\\"humidity_pct\\":" + String(humidity, 1) +
  "}";

  HTTPClient http;
  http.begin(INGEST_URL);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(body);
  Serial.printf("POST %d %s\\n", code, body.c_str());
  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_STATUS_LED, OUTPUT);
  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  SPI.begin();
  rfid.PCD_Init();
  tempSensors.begin();
  if (!ads.begin())  Serial.println("ADS1115 not found");
  if (!mpu.begin())  Serial.println("MPU6050 not found");
  if (!bme.begin(0x76)) Serial.println("BME280 not found");
  scale.begin(PIN_HX711_DT, PIN_HX711_SCK);
  scale.set_scale(SCALE_FACTOR);
  scale.tare();
  connectWifi();
}

void loop() {
  sampleActivity();

  String uid = readRfidUid();
  bool due = millis() - lastRead > READ_INTERVAL_MS;
  if (uid.length() == 0 && !due) { delay(50); return; }

  lastRead = millis();
  digitalWrite(PIN_STATUS_LED, HIGH);

  tempSensors.requestTemperatures();
  float milkTemp = tempSensors.getTempCByIndex(0);
  float bodyTemp = tempSensors.getTempCByIndex(1);
  float ec       = readMilkEc();
  float yieldL   = scale.get_units(5) / 1030.0f;   // grams -> litres of milk
  float envTemp  = bme.readTemperature();
  float humidity = bme.readHumidity();

  postReading(uid.length() ? uid : String("UNKNOWN"), ec, milkTemp,
              bodyTemp, yieldL, envTemp, humidity);

  stepCount = 0;
  digitalWrite(PIN_STATUS_LED, LOW);
}
`;
