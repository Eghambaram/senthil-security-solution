/** "19:00" → "7:00 PM" */
export function formatTime(hhmm: string): string {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
