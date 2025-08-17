
const PLUGIN_ACCESS_TOKEN_KEY = "care_access_token"; 


export function makeUrl(
  path: string,
  query?: Record<string, any>,
  pathParams?: Record<string, string | number>,
) {
  if (pathParams) {
    path = Object.entries(pathParams).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, `${value}`),
      path,
    );
  }

  if (query) {
    path += `?${makeQueryParams(query)}`;
  }

  return path;
}

function makeQueryParams(query: Record<string, any>) {
  const qParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((v) => qParams.append(key, `${v}`));
      return;
    }
    qParams.set(key, `${value}`);
  });
  return qParams.toString();
}
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