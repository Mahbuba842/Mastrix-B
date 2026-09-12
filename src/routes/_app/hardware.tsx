import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Battery,
  Cpu,
  Download,
  Droplets,
  Radio,
  Thermometer,
  Wifi,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FIRMWARE_CODE, FIRMWARE_FILENAME } from "@/lib/firmware";

export const Route = createFileRoute("/_app/hardware")({
  head: () => ({
    meta: [
      { title: "Hardware & ESP32 Firmware — Mastrix B" },
      {
        name: "description",
        content:
          "ESP32 sensor unit for mastitis early detection: pin map, wiring diagram, bill of materials and downloadable Arduino firmware.",
      },
      { property: "og:title", content: "Hardware & ESP32 Firmware — Mastrix B" },
      {
        property: "og:description",
        content:
          "Full ESP32 build guide for the Mastrix B sensor node — wiring, pin map, calibration and firmware download.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HardwarePage,
});

function HardwarePage() {
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
        title="Hardware & ESP32 firmware"
        description="The prototype field unit that collects multi-sensor data at the milking point or on the animal — with its wiring, calibration and firmware."
        actions={
          <Button onClick={downloadFirmware}>
            <Download className="size-4" aria-hidden /> Download firmware
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HARDWARE.map((h) => (
          <Card key={h.title}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <h.icon className="size-5 text-primary" aria-hidden /> {h.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {h.items.map((it, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="wiring" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
          <TabsTrigger value="wiring">Wiring</TabsTrigger>
          <TabsTrigger value="pins">Pin map</TabsTrigger>
          <TabsTrigger value="firmware">Firmware</TabsTrigger>
          <TabsTrigger value="bom">Parts & cost</TabsTrigger>
        </TabsList>

        <TabsContent value="wiring" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Wiring diagram</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-xl bg-muted p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
                <code>{WIRING_DIAGRAM}</code>
              </pre>
              <ul className="mt-4 space-y-2">
                {WIRING_NOTES.map((n, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {n}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Milking-point layout</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-xl bg-muted p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
                <code>{LAYOUT_DIAGRAM}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pins" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ESP32 DevKit v1 pin map</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-4">Pin</th>
                    <th className="py-2 pr-4">Connects to</th>
                    <th className="py-2 pr-4">Signal</th>
                    <th className="py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {PINS.map((p) => (
                    <tr key={p.pin} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-mono font-semibold">{p.pin}</td>
                      <td className="py-2 pr-4">{p.device}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{p.signal}</td>
                      <td className="py-2 text-muted-foreground">{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Calibration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {CALIBRATION.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firmware" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
              <CardTitle>{FIRMWARE_FILENAME}</CardTitle>
              <Button variant="outline" size="sm" onClick={downloadFirmware}>
                <Download className="size-4" aria-hidden /> Download .ino
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {FIRMWARE_FACTS.map((f) => (
                  <div key={f.label} className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {f.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{f.value}</p>
                  </div>
                ))}
              </div>
              <pre className="mt-4 max-h-[28rem] overflow-auto rounded-xl bg-muted p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
                <code>{FIRMWARE_CODE}</code>
              </pre>
              <p className="mt-3 text-sm text-muted-foreground">
                Open the file in Arduino IDE 2.x, select the ESP32 Dev Module board, set your Wi-Fi
                name, password and ingest URL at the top, then upload at 115200 baud.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Example JSON payload</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-relaxed">
                <code>{PAYLOAD}</code>
              </pre>
              <p className="mt-3 text-sm text-muted-foreground">
                This payload is sent per animal per milking. The backend stores the reading, computes
                deviations from the animal's personal baseline and updates the risk score.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bom" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bill of materials — one shed unit</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-4">Part</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2">Indicative cost</th>
                  </tr>
                </thead>
                <tbody>
                  {BOM.map((b) => (
                    <tr key={b.part} className="border-b border-border/60">
                      <td className="py-2 pr-4">{b.part}</td>
                      <td className="py-2 pr-4 tabular-nums">{b.qty}</td>
                      <td className="py-2 tabular-nums text-muted-foreground">{b.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm text-muted-foreground">
                Indicative prototype pricing in Indian rupees, roughly ₹4,700 per shed unit. Costs
                fall sharply at volume and one unit serves the whole milking point.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const HARDWARE = [
  {
    title: "Microcontroller",
    icon: Cpu,
    items: [
      "ESP32 DevKit v1 with Wi-Fi / Bluetooth",
      "Dual-core 240 MHz, enough for edge filtering",
      "Reads all sensors and posts JSON to cloud",
    ],
  },
  {
    title: "Milk conductivity",
    icon: Droplets,
    items: [
      "Stainless-steel EC probe in milk line",
      "ADS1115 16-bit ADC for stable readings",
      "Calibrated to mS/cm against herd baseline",
    ],
  },
  {
    title: "Temperature",
    icon: Thermometer,
    items: [
      "DS18B20 waterproof probe for body / milk temp",
      "One-Wire bus with unique ID per probe",
      "Detects small, persistent inflammation-driven rises",
    ],
  },
  {
    title: "Movement",
    icon: Activity,
    items: [
      "MPU6050 accelerometer on collar or leg strap",
      "Step count and lying-time estimates",
      "Reduced activity flags early discomfort",
    ],
  },
  {
    title: "Animal identity",
    icon: Radio,
    items: [
      "MFRC522 13.56 MHz RFID reader at the stall gate",
      "Ear-tag UID maps every reading to one animal",
      "No reading is stored without an identified animal",
    ],
  },
  {
    title: "Connectivity & power",
    icon: Wifi,
    items: [
      "Wi-Fi to shed router or mobile hotspot, MQTT / HTTPS batches",
      "Offline queue on SD card for bad-network days",
      "5 V USB or solar pack, deep-sleep between readings",
    ],
  },
];

const FIRMWARE_FACTS = [
  { label: "Board", value: "ESP32 DevKit v1" },
  { label: "Toolchain", value: "Arduino IDE 2.x · esp32 core 3.x" },
  { label: "Reading interval", value: "60 s, or on RFID scan" },
  {
    label: "Libraries",
    value: "OneWire, DallasTemperature, ADS1X15, MPU6050, BME280, HX711, MFRC522",
  },
  { label: "Upload speed", value: "115200 baud" },
  { label: "Battery", value: "Deep-sleep between readings" },
];

const WIRING_DIAGRAM = String.raw`
                        ESP32 DevKit v1
                    ┌───────────────────────┐
        3V3 ────────┤ 3V3               GND ├──────── GND rail
                    │                       │
  DS18B20 data ─────┤ GPIO4          GPIO21 ├──── SDA ──┬── ADS1115 (EC probe on A0)
   (4.7kΩ to 3V3)   │                       │           ├── MPU6050 (activity)
                    │                GPIO22 ├──── SCL ──┴── BME280  (shed temp/RH)
   HX711  DT  ──────┤ GPIO16                │
   HX711  SCK ──────┤ GPIO17         GPIO5  ├──── SS  ──┐
                    │                GPIO27 ├──── RST ──┤ MFRC522
   status LED ──────┤ GPIO2          GPIO18 ├──── SCK ──┤ RFID reader
                    │                GPIO19 ├──── MISO ─┤
        5V IN ──────┤ VIN            GPIO23 ├──── MOSI ─┘
                    └───────────────────────┘

   EC probe ──► ADS1115 A0        Load cell ──► HX711 (E+/E-/A+/A-)
   DS18B20 #1 in milk line, DS18B20 #2 against the udder (same One-Wire bus)
`;

const LAYOUT_DIAGRAM = String.raw`
   ┌────────────── milking point ──────────────┐
   │                                           │
   │   [RFID antenna]      cow enters stall    │
   │        │                                  │
   │        ▼                                  │
   │   ear-tag UID ──► ESP32 enclosure (IP65)  │
   │                       │  │  │             │
   │        milk line ─────┘  │  └──── udder   │
   │        (EC + temp)       │       DS18B20  │
   │                     load cell             │
   │                    under bucket           │
   │                                           │
   │   Wi-Fi ──► shed router ──► Mastrix B      │
   └───────────────────────────────────────────┘
`;

const WIRING_NOTES = [
  "Run one common ground: sensor grounds tied back to the ESP32 GND rail, not to shed earth.",
  "The DS18B20 One-Wire bus needs a single 4.7 kΩ pull-up between GPIO4 and 3V3, no matter how many probes.",
  "ADS1115, MPU6050 and BME280 share the I²C bus at addresses 0x48, 0x68 and 0x76 respectively.",
  "Keep the EC probe cable short and shielded; long unshielded runs pick up mains hum and add noise.",
  "Power the load cell and RFID reader from the 5 V rail, not the ESP32 3V3 regulator.",
  "House the board in an IP65 enclosure with a cable gland per probe — milking parlours get washed down.",
];

const CALIBRATION = [
  "EC probe: read two reference solutions (1.41 and 12.88 mS/cm), fit ecValue = slope × volts + offset, then set EC_SLOPE and EC_OFFSET.",
  "Load cell: tare with an empty bucket, place a known 5 kg weight, divide the raw reading by 5000 to get SCALE_FACTOR.",
  "DS18B20: check both probes in a stirred ice-water bath; a fixed offset over 0.3 °C is corrected in firmware.",
  "Activity: adjust the 11.5 m/s² step threshold over one day of walking so the step count matches a manual count.",
  "Baselines: run 7-10 milkings per animal before trusting risk scores — the engine needs each animal's own normal.",
];

const PINS = [
  { pin: "GPIO4", device: "DS18B20 ×2", signal: "One-Wire data", note: "4.7 kΩ pull-up to 3V3" },
  { pin: "GPIO21", device: "ADS1115 / MPU6050 / BME280", signal: "I²C SDA", note: "Shared bus" },
  { pin: "GPIO22", device: "ADS1115 / MPU6050 / BME280", signal: "I²C SCL", note: "Shared bus" },
  { pin: "GPIO16", device: "HX711", signal: "Data (DT)", note: "Milk yield load cell" },
  { pin: "GPIO17", device: "HX711", signal: "Clock (SCK)", note: "Milk yield load cell" },
  { pin: "GPIO5", device: "MFRC522", signal: "SPI SS", note: "RFID chip select" },
  { pin: "GPIO27", device: "MFRC522", signal: "RST", note: "Reader reset" },
  { pin: "GPIO18/19/23", device: "MFRC522", signal: "SCK / MISO / MOSI", note: "Hardware SPI" },
  { pin: "GPIO2", device: "Status LED", signal: "Digital out", note: "Blinks on each upload" },
  { pin: "VIN", device: "5 V supply", signal: "Power in", note: "Shed USB or solar pack" },
];

const BOM = [
  { part: "ESP32 DevKit v1", qty: 1, cost: "₹450" },
  { part: "Stainless EC probe + ADS1115 ADC", qty: 1, cost: "₹1,150" },
  { part: "DS18B20 waterproof probe", qty: 2, cost: "₹320" },
  { part: "MPU6050 accelerometer", qty: 1, cost: "₹180" },
  { part: "BME280 temperature / humidity", qty: 1, cost: "₹250" },
  { part: "Load cell + HX711 amplifier", qty: 1, cost: "₹700" },
  { part: "MFRC522 RFID reader + ear tags", qty: 1, cost: "₹550" },
  { part: "IP65 enclosure, glands, wiring", qty: 1, cost: "₹600" },
  { part: "5 V supply / solar pack + SD module", qty: 1, cost: "₹500" },
];

const PAYLOAD = `{
  "device_id": "ESP32-SHED-A-01",
  "timestamp": "2025-09-12T08:35:00Z",
  "rfid_uid": "A1:B2:C3:D4",
  "animal_code": "C024",
  "milk_ec": 5.4,
  "milk_temp_c": 38.8,
  "body_temp_c": 39.1,
  "milk_yield_l": 11.2,
  "activity_steps": 6400,
  "env_temp_c": 31.0,
  "humidity_pct": 72
}`;
