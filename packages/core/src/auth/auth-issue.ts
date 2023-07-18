export async function authIssue(apiKey: string, url = "https://auth.streamingfast.io/v1/auth/issue") {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
  });

  if (!response.ok) {
    throw new Error(`Failed to issue token (code ${response.status}): ${response.statusText}`);
  }

  const token = await response.json();
  if (token?.token != null && token?.expires_at != null) {
    return {
      token: `${token.token}`,
      expires_at: Number(token.expires_at),
    };
  }

  throw new Error("Received malformatted token response");
}

export async function parseAuthorization(authorization: string, url?: string) {
  // issue token if server_ or 32 char token is provided
  if (authorization.includes("server_") || authorization.length === 32) {
    const { token } = await authIssue(authorization, url);

    return token;
  }

  // no action if Substreams API token is provided
  return authorization;
}
