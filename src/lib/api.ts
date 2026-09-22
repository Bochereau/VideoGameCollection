import type {
  CatalogCover,
  CatalogGame,
  CatalogPlatform,
  ConsoleItem,
  Game,
  GameInput,
  GamesQuery,
  PublicWishlist,
  Top,
  TopInput,
  TopSummary,
  TopUpdate,
  WishlistShareLink,
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
  if (params.status) search.set('status', params.status)
  if (params.favorite !== undefined) {
    search.set('favorite', String(params.favorite))
  }
  if (params.q) search.set('q', params.q)
  if (params.nameExact) search.set('nameExact', params.nameExact)
  if (params.format) search.set('format', params.format)
  if (params.condition) search.set('condition', params.condition)
  if (params.edition) search.set('edition', params.edition)
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
  list: (token: string, opts?: { wishlist?: boolean }) => {
    const params = new URLSearchParams()
    if (opts?.wishlist === true) params.set('wishlist', 'true')
    if (opts?.wishlist === false) params.set('wishlist', 'false')
    const qs = params.toString()
    return apiFetch<ConsoleItem[]>(`/api/consoles${qs ? `?${qs}` : ''}`, token)
  },

  create: (token: string, name: string, igdbId?: number | null) =>
    apiFetch<ConsoleItem>('/api/consoles', token, {
      method: 'POST',
      body: JSON.stringify({
        name,
        ...(igdbId != null ? { igdbId } : {}),
      }),
    }),

  remove: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(
      `/api/consoles?id=${encodeURIComponent(id)}`,
      token,
      { method: 'DELETE' },
    ),

  update: (token: string, id: string, name: string) =>
    apiFetch<ConsoleItem>(`/api/consoles?id=${encodeURIComponent(id)}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }),
}

export const topsApi = {
  list: (token: string) => apiFetch<TopSummary[]>('/api/tops', token),

  get: (token: string, id: string) =>
    apiFetch<Top>(`/api/tops?id=${encodeURIComponent(id)}`, token),

  create: (token: string, body: TopInput) =>
    apiFetch<Top>('/api/tops', token, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (token: string, id: string, body: TopUpdate) =>
    apiFetch<Top>(`/api/tops?id=${encodeURIComponent(id)}`, token, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  remove: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/api/tops?id=${encodeURIComponent(id)}`, token, {
      method: 'DELETE',
    }),
}

export function wishlistShareUrl(token: string) {
  return `${window.location.origin}/envies/${token}`
}

export const wishlistShareApi = {
  get: (token: string) =>
    apiFetch<WishlistShareLink>('/api/wishlist/share', token),

  save: (token: string, body: { ownerName?: string; rotate?: boolean }) =>
    apiFetch<WishlistShareLink>('/api/wishlist/share', token, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  revoke: (token: string) =>
    apiFetch<{ ok: boolean }>('/api/wishlist/share', token, {
      method: 'DELETE',
    }),

  public: (shareToken: string) =>
    apiFetch<PublicWishlist>(
      `/api/wishlist/share?token=${encodeURIComponent(shareToken)}`,
      null,
    ),
}

export const catalogApi = {
  searchGames: (token: string, q: string, hardware?: string) => {
    const params = new URLSearchParams({ q })
    if (hardware) params.set('hardware', hardware)
    return apiFetch<CatalogGame[]>(`/api/catalog/games?${params}`, token)
  },

  gameDetails: (token: string, igdbId: number) =>
    apiFetch<CatalogGame>(`/api/catalog/games/${igdbId}`, token),

  platforms: (token: string, q = '') =>
    apiFetch<CatalogPlatform[]>(
      `/api/catalog/platforms${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      token,
    ),

  searchCovers: (
    token: string,
    q: string,
    hardware?: string,
    igdbId?: number | null,
  ) => {
    const params = new URLSearchParams({ q })
    if (hardware) params.set('hardware', hardware)
    if (igdbId != null) params.set('igdbId', String(igdbId))
    return apiFetch<{ configured: boolean; results: CatalogCover[] }>(
      `/api/catalog/covers?${params}`,
      token,
    )
  },
}
