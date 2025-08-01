
type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>;
export interface ApiRoute<TData, TBody = unknown> {
  baseUrl?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  TBody?: TBody;
  path: string;
  TRes: TData;
  noAuth?: boolean;
}
export type QueryParams = Record<string, QueryParamValue>;

type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
    ? Param | ExtractRouteParams<Rest>
    : never;

type PathParams<T extends string> = {
  [_ in ExtractRouteParams<T>]: string;
};
export interface ApiCallOptions<Route extends ApiRoute<unknown, unknown>> {
  pathParams?: PathParams<Route["path"]>;
  queryParams?: QueryParams;
  body?: Route["TBody"];
  silent?: boolean | ((response: Response) => boolean);
  signal?: AbortSignal;
  headers?: HeadersInit;
}
