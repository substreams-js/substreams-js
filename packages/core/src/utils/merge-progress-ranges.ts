export type ProgressRange = [from: bigint, to: bigint];

/**
 * Merges progress ranges.
 *
 * @param ranges The ranges to merge.
 * @returns The merged ranges.
 */
export function mergeProgressRanges(ranges: ProgressRange[]) {
  const sorted = ranges.slice().sort(([a], [b]) => {
    return a === b ? 0 : a < b ? -1 : 1;
  });

  return mergeSortedProgressRanges(sorted);
}

/**
 * Merges progress ranges that are already sorted.
 *
 * @param ranges The ranges to merge.
 * @returns The merged ranges.
 */
export function mergeSortedProgressRanges(ranges: ProgressRange[]) {
  let [previous] = ranges;
  if (previous === undefined) {
    return [];
  }

  // Ensure we are not modifying the original array.
  previous = [previous[0], previous[1]];
  const result = [previous];

  for (const next of ranges) {
    if (next[0] > previous[1] + BigInt(1)) {
      previous = [next[0], next[1]];
      result.push(previous);
      continue;
    }

    if (next[1] > previous[1]) {
      previous[1] = next[1];
    }
  }

  return result;
}
