import { callApi } from "./query";
import type { ApiCallOptions, ApiRoute } from "./types";

export default function mutate<Route extends ApiRoute<unknown, unknown>>(
    route: Route,
    options?: ApiCallOptions<Route>,
  ) {
    return (variables: Route["TBody"]) => {
      return callApi(route, { ...options, body: variables });
    };
  }
  