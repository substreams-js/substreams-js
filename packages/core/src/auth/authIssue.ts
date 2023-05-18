export interface Token {
    token: string;
    expires_at: number;
}

export const DEFAULT_AUTH = "https://auth.streamingfast.io/v1/auth/issue";

export async function authIssue(api_key: string, url = DEFAULT_AUTH) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({api_key})
    })
    return response.json() as Promise<Token>;
}

export async function parseAuthorization(authorization: string, url?: string) {
    // issue token if server_ or 32 char token is provided
    if ( authorization.includes("server_") || authorization.length == 32 ) {
        const { token } = await authIssue(authorization, url);
        return token;
    }
    // no action if Substreams API token is provided
    return authorization;
}