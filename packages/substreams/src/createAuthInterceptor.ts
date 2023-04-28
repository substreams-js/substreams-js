import type { Interceptor } from "@bufbuild/connect";

export function createAuthInterceptor(token: string): Interceptor {
  return (next) => async (req) => {
    if (!req.header.has("Authorization")) {
      req.header.set("Authorization", token);
    }

    return next(req);
  };
}
