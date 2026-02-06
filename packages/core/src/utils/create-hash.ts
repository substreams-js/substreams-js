export async function createHash(array: Uint8Array) {
  // Ensure we pass a proper ArrayBuffer that crypto.subtle.digest accepts
  // We create a new ArrayBuffer from the Uint8Array to handle SharedArrayBuffer cases
  const buffer = new Uint8Array(array).buffer;
  const hash = await globalThis.crypto.subtle.digest("SHA-1", buffer);
  return new Uint8Array(hash);
}
