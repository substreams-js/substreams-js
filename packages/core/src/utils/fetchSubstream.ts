import { createSubstream } from "./createSubstream.js";

export async function fetchSubstream(...args: Parameters<typeof fetch>) {
  const buffer = await fetch(...args)
    .then((response) => response.blob())
    .then((blob) => blob.arrayBuffer());

  return createSubstream(buffer);
}
