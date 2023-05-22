if (process.env.SUBSTREAMS_API_TOKEN === undefined) {
  throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
}

export const token = process.env.SUBSTREAMS_API_TOKEN;
