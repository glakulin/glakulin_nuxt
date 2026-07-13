// server/api/steamgriddb/icons/index.post.ts

// Простой in-memory кэш иконок (TTL 24ч, общий для всех запросов в рамках процесса)
interface IconCacheEntry {
  ts: number;
  url: string | null;
}
const ICON_CACHE = new Map<number, IconCacheEntry>();
const ICON_CACHE_TTL = 60 * 60 * 24 * 1000; // 24ч

const fetchIcon = async (steamId: number) => {
  const cached = ICON_CACHE.get(steamId)
  if (cached && Date.now() - cached.ts < ICON_CACHE_TTL) {
    return { steamId, url: cached.url }
  }

  const apiKey = useRuntimeConfig().steamgriddbApiKey
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'SteamGridDB API key is not configured' })
  }

  try {
    // Добавляем query-параметры для фильтрации
    const response = await $fetch(`https://www.steamgriddb.com/api/v2/icons/steam/${steamId}`, {
      method: 'GET',
      query: {
        styles: 'official',    // Только официальные иконки
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    let url: string | null = null
    if (response.success && response.data && response.data.length > 0) {
      // Сортируем по score (убывание), чтобы взять иконку наивысшего качества
      const sorted = response.data.sort((a, b) => b.score - a.score)
      url = sorted[0].url
    }

    ICON_CACHE.set(steamId, { ts: Date.now(), url })
    return { steamId, url }
  } catch (error) {
    console.warn(`Failed to fetch icon for Steam ID ${steamId}:`, error)
    return { steamId, url: null }
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const steamIds: number[] = body?.steam_ids

  if (!Array.isArray(steamIds) || steamIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'steam_ids must be a non-empty array' })
  }

  const results = await Promise.allSettled(steamIds.map(fetchIcon))
  
  const iconsMap: Record<number, string | null> = {}
  for (const result of results) {
    if (result.status === 'fulfilled') {
      iconsMap[result.value.steamId] = result.value.url
    }
  }

  return iconsMap
})