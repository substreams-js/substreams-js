export function mergeProgressRanges(ranges: [bigint, bigint][]) {
  let [previous] = ranges.slice().sort(([a], [b]) => {
    return a === b ? 0 : a < b ? -1 : 1;
  });

  if (previous === undefined) {
    return [];
  }

  // Ensure we are not modifying the original array.
  previous = [previous[0], previous[1]];
  const result = [previous];

  for (const next of ranges) {
    if (next[0] > previous[1] + 1n) {
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

export function trackProgress() {}
