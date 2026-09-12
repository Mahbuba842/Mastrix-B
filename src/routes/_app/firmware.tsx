import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Download,
  FileCode,
  Terminal,
  Usb,
  Wifi,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIRMWARE_CODE, FIRMWARE_FILENAME } from "@/lib/firmware";

export const Route = createFileRoute("/_app/firmware")({
  head: () => ({
    meta: [
      { title: "ESP32 Firmware — Mastrix B" },
      {
        name: "description",
        content:
          "ESP32 firmware for the Mastrix B mastitis sensor node: board specs, library list, flashing steps and a firmware download.",
      },
      { property: "og:title", content: "ESP32 Firmware — Mastrix B" },
      {
        property: "og:description",
        content:
          "Download and flash the Mastrix B ESP32 firmware: specs, setup steps, Wi-Fi configuration and ingest endpoint.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FirmwarePage,
});

const SPECS = [
  { label: "Board", value: "ESP32 DevKit v1 (dual-core 240 MHz)" },
  { label: "Flash / RAM", value: "4 MB flash · 520 KB SRAM" },
  { label: "Connectivity", value: "Wi-Fi 802.11 b/g/n, HTTPS POST" },
  { label: "Power", value: "5 V USB or 3.7 V Li-ion + TP4056 charger" },
  { label: "Sampling interval", value: "60 s (configurable)" },
  { label: "Offline buffer", value: "Up to 200 readings in flash (SPIFFS)" },
  { label: "Toolchain", value: "Arduino IDE 2.x · arduino-esp32 core 3.x" },
  { label: "Firmware file", value: FIRMWARE_FILENAME },
];

const SENSORS = [
  { name: "Milk EC probe", iface: "ADS1115 (I²C, 0x48)", signal: "Milk conductivity (mS/cm)" },
  { name: "DS18B20 ×2", iface: "OneWire — GPIO 4", signal: "Milk & body temperature (°C)" },
  { name: "Load cell + HX711", iface: "GPIO 16 / 17", signal: "Milk yield (litres)" },
  { name: "MPU6050", iface: "I²C (0x68)", signal: "Activity index (steps/day)" },
  { name: "BME280", iface: "I²C (0x76)", signal: "Shed temperature, humidity, THI" },
  { name: "MFRC522 RFID", iface: "SPI — CS GPIO 5", signal: "Animal tag UID" },
];

const LIBRARIES = [
  "OneWire",
  "DallasTemperature",
  "Adafruit_ADS1X15",
  "Adafruit_MPU6050",
  "Adafruit_BME280",
  "HX711",
  "MFRC522",
];

const STEPS = [
  {
    icon: Download,
    title: "1. Download the firmware",
    detail: `Save ${FIRMWARE_FILENAME} and open it in Arduino IDE 2.x. Keep the file inside a folder with the same name.`,
  },
  {
    icon: Cpu,
    title: "2. Install the ESP32 core",
    detail:
      "In Boards Manager add the esp32 package (3.x) and select 'ESP32 Dev Module'. Set Flash Size 4 MB, Partition Scheme Default.",
  },
  {
    icon: FileCode,
    title: "3. Install the libraries",
    detail: `Library Manager → install: ${LIBRARIES.join(", ")}.`,
  },
  {
    icon: Wifi,
    title: "4. Configure the node",
    detail:
      "Edit WIFI_SSID, WIFI_PASSWORD, DEVICE_ID and INGEST_URL at the top of the sketch. INGEST_URL points to this app's /api/public/readings endpoint.",
  },
  {
    icon: Usb,
    title: "5. Flash the board",
    detail:
      "Connect over USB, pick the serial port, press Upload. Hold BOOT if the board does not enter download mode automatically.",
  },
  {
    icon: Terminal,
    title: "6. Verify",
    detail:
      "Open Serial Monitor at 115200 baud. You should see Wi-Fi connected, an RFID UID on tag scan and 'POST 200' after each reading.",
  },
];

function FirmwarePage() {
  function downloadFirmware() {
    const blob = new Blob([FIRMWARE_CODE], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = FIRMWARE_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="ESP32 firmware"
        description="Everything needed to build and flash a Mastrix B sensor node — board specs, sensor interfaces, setup steps and the firmware sketch."
        actions={
          <div className="flex gap-2">
            <Link to="/hardware">
              <Button variant="outline" size="sm">
                <CircuitBoard className="size-4" aria-hidden /> Wiring & hardware
              </Button>
            </Link>
            <Button size="sm" onClick={downloadFirmware}>
              <Download className="size-4" aria-hidden /> Download {FIRMWARE_FILENAME}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="size-4 text-primary" aria-hidden /> Hardware specs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {SPECS.map((s) => (
                <div key={s.label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Sensors read by this firmware</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Sensor</th>
                    <th className="pb-2 pr-4 font-medium">Interface</th>
                    <th className="pb-2 font-medium">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {SENSORS.map((s) => (
                    <tr key={s.name} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-4 font-medium">{s.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{s.iface}</td>
                      <td className="py-2 text-muted-foreground">{s.signal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Setup steps</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="card-surface p-5">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-primary" aria-hidden />
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-surface mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Firmware sketch</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Prototype Arduino sketch — calibrate every probe against your own herd before trusting a reading.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{FIRMWARE_FILENAME}</Badge>
            <Button size="sm" onClick={downloadFirmware}>
              <Download className="size-4" aria-hidden /> Download
            </Button>
          </div>
        </div>
        <pre className="mt-4 max-h-[420px] overflow-auto rounded-xl bg-muted p-4 text-xs leading-relaxed">
          <code>{FIRMWARE_CODE}</code>
        </pre>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-risk-low" aria-hidden />
          Each reading is posted as JSON to the ingest endpoint and stored in the Mastrix B database.
        </p>
      </section>
    </div>
  );
}
