import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type SensorReadingInsert = Database['public']['Tables']['sensor_readings']['Insert'];
export type SensorReading = Database['public']['Tables']['sensor_readings']['Row'];

export async function getRecentSensorReadings(limit = 8) {
  const result = await supabase.from('sensor_readings').select('*').order('recorded_at', { ascending: false }).limit(limit);
  if (result.error) throw result.error;
  return result.data;
}

export async function sendSensorReading(reading: SensorReadingInsert) {
  const result = await supabase.from('sensor_readings').insert(reading).select().single();
  if (result.error) throw result.error;
  return result.data;
}
