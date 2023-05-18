import { createSubstream } from "./createSubstream.js";

export async function fetchSubstream(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const array = await blob.arrayBuffer();

  return createSubstream(array);
}
