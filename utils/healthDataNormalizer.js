export const normalizeHeartRateData = (record) => {
  if (!record) return null;
  
  const bpm = record.beatsPerMinute ?? 
    record.value ?? 
    record.samples?.[0]?.beatsPerMinute ?? 
    record.samples?.[0]?.value ?? 
    null;
    
  return { ...record, beatsPerMinute: bpm };
};

export const normalizeSpo2Data = (record) => {
  if (!record) return null;
  
  let percentage = record.percentage ?? 
    record.value ?? 
    record.saturation ?? 
    record.samples?.[0]?.value ?? 
    null;
  
  // Convert percentage to decimal if needed (e.g., 98 -> 0.98)
  if (percentage !== null && percentage > 1.0) {
    percentage = percentage / 100;
  }
  
  return { ...record, percentage };
};

export const formatSpo2Value = (spo2Record) => {
  if (!spo2Record || spo2Record.percentage === null || spo2Record.percentage === undefined) {
    return '--';
  }
  return `${Math.round(spo2Record.percentage * 100)}`;
};