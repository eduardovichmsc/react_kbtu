export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface RequestMeta {
  status: RequestStatus;
  error: string | null;
  requestId: string | null;
  fetchedAt: number | null;
  stale: boolean;
}

export interface ListEntry extends RequestMeta {
  ids: number[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface AllEntry extends RequestMeta {
  ids: number[];
}

export const emptyMeta = (): RequestMeta => ({
  status: "idle",
  error: null,
  requestId: null,
  fetchedAt: null,
  stale: false,
});

export const CACHE_TTL = 5 * 60 * 1000;

export function shouldFetch(meta: RequestMeta | undefined, force = false) {
  if (!meta) return true;
  if (meta.status === "loading") return false;
  if (force || meta.stale || meta.status !== "succeeded") return true;
  return !meta.fetchedAt || Date.now() - meta.fetchedAt > CACHE_TTL;
}

export function needsFetch(meta: RequestMeta | undefined) {
  if (!meta) return true;
  if (meta.status === "idle") return true;
  return meta.stale && meta.status !== "loading" && meta.status !== "failed";
}
