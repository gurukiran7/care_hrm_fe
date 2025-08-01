const PLUGIN_ACCESS_TOKEN_KEY = "care_access_token"; 

export function getAuthorizationHeader() {
  const accessToken = localStorage.getItem(PLUGIN_ACCESS_TOKEN_KEY);
  return accessToken ? `Bearer ${accessToken}` : null;
}

export function makeHeaders(noAuth: boolean, additionalHeaders?: HeadersInit) {
  const headers = new Headers(additionalHeaders);
  headers.set("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  const authorizationHeader = getAuthorizationHeader();
  if (authorizationHeader && !noAuth) {
    headers.set("Authorization", authorizationHeader);
  }

  return headers;
}