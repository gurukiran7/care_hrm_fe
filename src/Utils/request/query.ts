import { RESULTS_PER_PAGE_LIMIT } from "../../common/constants";
import type { ApiCallOptions, ApiRoute, PaginatedResponse } from "./types";
import { makeHeaders, makeUrl } from "./utils";

const API_BASE_URL = import.meta.env.VITE_REACT_CARE_API_URL || "";

export async function callApi<Route extends ApiRoute<unknown, unknown>>(
  { path, method, noAuth }: Route,
  options?: ApiCallOptions<Route>
) {
  const url = `${API_BASE_URL}${makeUrl(path, options?.queryParams, options?.pathParams)}`;
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
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function query<Route extends ApiRoute<unknown, unknown>>(
  route: Route,
  options?: ApiCallOptions<Route>,
) {
  return ({ signal }: { signal: AbortSignal }) => {
    return callApi(route, { ...options, signal });
  };
}
const debouncedQuery = <Route extends ApiRoute<unknown, unknown>>(
  route: Route,
  options?: ApiCallOptions<Route> & { debounceInterval?: number },
) => {
  return async ({ signal }: { signal: AbortSignal }) => {
    await sleep(options?.debounceInterval ?? 500);
    return query(route, { ...options })({ signal });
  };
};
query.debounced = debouncedQuery;

const paginatedQuery = <
  Route extends ApiRoute<PaginatedResponse<unknown>, unknown>,
>(
  route: Route,
  options?: ApiCallOptions<Route> & { pageSize?: number; maxPages?: number },
) => {
  return async ({ signal }: { signal: AbortSignal }) => {
    const items: Route["TRes"]["results"] = [];
    let hasNextPage = true;
    let page = 0;
    let count = 0;

    const pageSize = options?.pageSize ?? RESULTS_PER_PAGE_LIMIT;

    while (hasNextPage) {
      const res = await query(route, {
        ...options,
        queryParams: {
          limit: pageSize,
          offset: page * pageSize,
          ...options?.queryParams,
        },
      })({ signal });

      count = res.count;
      items.push(...res.results);

      if (options?.maxPages && page >= options.maxPages - 1) {
        hasNextPage = false;
      }

      if (items.length >= res.count) {
        hasNextPage = false;
      }

      page++;
    }

    return {
      count,
      results: items,
    };
  };
};
query.paginated = paginatedQuery;
