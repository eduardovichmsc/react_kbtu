import type { LocalChanges } from "@/features/products/query";

const KEY = "kbtu_redux_state_v1";

export interface PersistedState {
  local?: LocalChanges;
  favorites?: Record<string, number[]>;
}

export function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : {};
  } catch {
    return {};
  }
}

export function savePersisted(state: PersistedState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
  }
}
