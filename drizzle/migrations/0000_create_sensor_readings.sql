CREATE TABLE public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  animal_id TEXT NOT NULL,
  rfid_tag TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  milk_ec NUMERIC(6,2),
  milk_temperature NUMERIC(5,2),
  body_temperature NUMERIC(5,2),
  milk_yield NUMERIC(7,2),
  activity INTEGER,
  accel_x NUMERIC(8,3),
  accel_y NUMERIC(8,3),
  accel_z NUMERIC(8,3),
  environmental_temperature NUMERIC(5,2),
  humidity NUMERIC(5,2),
  thi NUMERIC(6,2),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
GRANT SELECT, INSERT ON public.sensor_readings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sensor_readings TO authenticated;
GRANT ALL ON public.sensor_readings TO service_role;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read sensor readings" ON public.sensor_readings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert sensor readings" ON public.sensor_readings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX sensor_readings_recorded_at_idx ON public.sensor_readings (recorded_at DESC);
CREATE INDEX sensor_readings_device_id_idx ON public.sensor_readings (device_id, recorded_at DESC);
CREATE INDEX sensor_readings_animal_id_idx ON public.sensor_readings (animal_id, recorded_at DESC);