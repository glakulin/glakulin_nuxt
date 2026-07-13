// server/api/steamgriddb/icons/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const steamIds: number[] = body?.steam_ids
  
  if (!Array.isArray(steamIds) || steamIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'steam_ids must be a non-empty array' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.steamgriddbApiKey

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'SteamGridDB API key is not configured' })
  }

  const fetchIcon = async (steamId: number) => {
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
      
      if (response.success && response.data && response.data.length > 0) {
        // Сортируем по score (убывание), чтобы взять иконку наивысшего качества
        const sorted = response.data.sort((a, b) => b.score - a.score)
        return { steamId, url: sorted[0].url }
      }
      return { steamId, url: null }
    } catch (error) {
      console.warn(`Failed to fetch icon for Steam ID ${steamId}:`, error)
      return { steamId, url: null }
    }
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