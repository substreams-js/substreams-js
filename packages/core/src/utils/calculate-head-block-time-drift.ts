export function calculateHeadBlockTimeDrift(timestamp: Date) {
  const seconds = timestamp.getSeconds();
  const current = Math.floor(Date.now() / 1000);
  return current - seconds;
}
