export async function createHash(array: Uint8Array) {
  const hash = await globalThis.crypto.subtle.digest("SHA-1", array);
  return new Uint8Array(hash);
}
