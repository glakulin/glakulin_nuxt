// server/api/steamgriddb/logos/index.post.ts

// Простой in-memory кэш логотипов (TTL 24ч, общий для всех запросов в рамках процесса)
interface LogoCacheEntry {
  ts: number;
  url: string | null;
}
const LOGO_CACHE = new Map<number, LogoCacheEntry>();
const LOGO_CACHE_TTL = 60 * 60 * 24 * 1000; // 24ч

const fetchLogo = async (steamId: number) => {
  const cached = LOGO_CACHE.get(steamId)
  if (cached && Date.now() - cached.ts < LOGO_CACHE_TTL) {
    return { steamId, url: cached.url }
  }

  const apiKey = useRuntimeConfig().steamgriddbApiKey
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'SteamGridDB API key is not configured' })
  }

  try {
    // Добавляем query-параметры для фильтрации
    const response = await $fetch(`https://www.steamgriddb.com/api/v2/logos/steam/${steamId}`, {
      method: 'GET',
      query: {
        styles: 'official',    // Только официальные логотипы
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    let url: string | null = null
    if (response.success && response.data && response.data.length > 0) {
      // Сортируем по score (убывание), чтобы взять логотип наивысшего качества
      const sorted = response.data.sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      url = sorted[0].url
    }

    LOGO_CACHE.set(steamId, { ts: Date.now(), url })
    return { steamId, url }
  } catch (error) {
    console.warn(`Failed to fetch logo for Steam ID ${steamId}:`, error)
    return { steamId, url: null }
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const steamIds: number[] = body?.steam_ids

  if (!Array.isArray(steamIds) || steamIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'steam_ids must be a non-empty array' })
  }

  const results = await Promise.allSettled(steamIds.map(fetchLogo))

  const logosMap: Record<number, string | null> = {}
  for (const result of results) {
    if (result.status === 'fulfilled') {
      logosMap[result.value.steamId] = result.value.url
    }
  }

  return logosMap
})
