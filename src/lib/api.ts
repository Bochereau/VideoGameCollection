import type {
  CatalogGame,
  CatalogPlatform,
  ConsoleItem,
  Game,
  GameInput,
  GamesQuery,
} from '@/types'

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

function apiUrl(path: string) {
  return `${API_BASE}${path}`
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : `Request failed (${res.status})`
    throw new Error(message)
  }
  return data as T
}

export async function apiFetch<T>(
  path: string,
  token: string | null,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(apiUrl(path), { ...init, headers })
  return parseJson<T>(res)
}

function toQuery(params: GamesQuery): string {
  const search = new URLSearchParams()
  if (params.wishlist !== undefined) {
    search.set('wishlist', String(params.wishlist))
  }
  if (params.hardware) search.set('hardware', params.hardware)
  if (params.finished !== undefined) {
    search.set('finished', String(params.finished))
  }
  if (params.q) search.set('q', params.q)
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const gamesApi = {
  list: (token: string, query: GamesQuery = {}) =>
    apiFetch<Game[]>(`/api/games${toQuery(query)}`, token),

  create: (token: string, body: GameInput) =>
    apiFetch<Game>('/api/games', token, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (token: string, id: string, body: Partial<GameInput>) =>
    apiFetch<Game>(`/api/games?id=${encodeURIComponent(id)}`, token, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  remove: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/api/games?id=${encodeURIComponent(id)}`, token, {
      method: 'DELETE',
    }),
}

export const consolesApi = {
  list: (token: string) => apiFetch<ConsoleItem[]>('/api/consoles', token),

  create: (token: string, name: string) =>
    apiFetch<ConsoleItem>('/api/consoles', token, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  remove: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(
      `/api/consoles?id=${encodeURIComponent(id)}`,
      token,
      { method: 'DELETE' },
    ),
}

export const catalogApi = {
  searchGames: (token: string, q: string) =>
    apiFetch<CatalogGame[]>(
      `/api/catalog/games?q=${encodeURIComponent(q)}`,
      token,
    ),

  gameDetails: (token: string, rawgId: number) =>
    apiFetch<CatalogGame>(`/api/catalog/games/${rawgId}`, token),

  platforms: (token: string, q = '') =>
    apiFetch<CatalogPlatform[]>(
      `/api/catalog/platforms${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      token,
    ),
}
