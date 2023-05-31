export function calculateHeadBlockTimeDrift(timestamp: Date) {
  const seconds = timestamp.getSeconds();
  const current = Math.floor(new Date().valueOf() / 1000);
  return current - seconds;
}
