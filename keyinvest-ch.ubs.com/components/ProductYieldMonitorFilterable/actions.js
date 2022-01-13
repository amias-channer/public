export const YIELD_MONITOR_FILTERABLE_TRIGGER_EXPORT = 'YieldMonitorFilterable/YIELD_MONITOR_FILTERABLE_TRIGGER_EXPORT';

export function yieldMonitorFilterableTriggerExport(jobListKey, fileType) {
  return {
    type: YIELD_MONITOR_FILTERABLE_TRIGGER_EXPORT,
    jobListKey,
    fileType,
  };
}
