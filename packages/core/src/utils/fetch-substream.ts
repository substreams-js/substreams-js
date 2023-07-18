import { createSubstream } from "./create-substream.js";

export async function fetchSubstream(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`Failed to fetch substream (code ${response.status}): ${response.statusText}`);
  }

  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();

  return createSubstream(buffer);
}
