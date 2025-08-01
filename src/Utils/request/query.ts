import type { ApiCallOptions, ApiRoute } from "./types";
import { makeHeaders } from "./utils";

const API_BASE_URL = import.meta.env.VITE_REACT_CARE_API_URL || "";

export async function callApi<Route extends ApiRoute<unknown, unknown>>(
  { path, method, noAuth }: Route,
  options?: ApiCallOptions<Route>
) {
  const url = `${API_BASE_URL}${path}`;
  const fetchOptions: RequestInit = {
    method,
    headers: makeHeaders(noAuth ?? false, options?.headers),
    signal: options?.signal,
  };
  if (options?.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }
  const response = await fetch(url, fetchOptions);
  if (!response.ok) throw new Error("API error");
  return response.json();
}

export default function query<Route extends ApiRoute<unknown, unknown>>(
  route: Route,
  options?: ApiCallOptions<Route>
) {
  return ({ signal }: { signal: AbortSignal }) => {
    return callApi(route, { ...options, signal });
  };
}
