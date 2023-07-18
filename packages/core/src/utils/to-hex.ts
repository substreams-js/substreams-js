export function toHex(array: Uint8Array) {
  return Array.from(array, (value) => value.toString(16).padStart(2, "0")).join("");
}
