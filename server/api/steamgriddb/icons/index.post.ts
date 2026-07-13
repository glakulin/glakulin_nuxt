// server/api/steamgriddb/icons/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const steamIds: number[] = body?.steam_ids
  
  if (!Array.isArray(steamIds) || steamIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'steam_ids must be a non-empty array' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.steamgriddbApiKey
  const supabase = useSupabaseServerClient(event)

  // 1. Проверяем, какие иконки уже есть в базе
  const { data: existingIcons } = await supabase
    .from('games')
    .select('steam_id, icon_url')
    .in('steam_id', steamIds)
    .not('icon_url', 'is', null)

  const existingMap = new Map(
    existingIcons?.map(icon => [icon.steam_id, icon.icon_url]) || []
  )

  // 2. Определяем, для каких игр нужно получить иконки
  const missingIds = steamIds.filter(id => !existingMap.has(id))
  
  if (missingIds.length === 0) {
    // Все иконки уже есть в базе
    return Object.fromEntries(existingMap)
  }

  // 3. Получаем недостающие иконки из SteamGridDB
  const fetchIcon = async (steamId: number) => {
    try {
      const response = await $fetch(`https://www.steamgriddb.com/api/v2/icons/steam/${steamId}`, {
        method: 'GET',
        query: {
          styles: 'official',
          mimes: 'image/png',
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      
      if (response.success && response.data && response.data.length > 0) {
        const sorted = response.data.sort((a, b) => b.score - a.score)
        return { steamId, url: sorted[0].url }
      }
      return { steamId, url: null }
    } catch (error) {
      console.warn(`Failed to fetch icon for Steam ID ${steamId}:`, error)
      return { steamId, url: null }
    }
  }

  const results = await Promise.allSettled(missingIds.map(fetchIcon))
  
  const newIconsMap: Record<number, string | null> = {}
  const updates: Array<{ steam_id: number; icon_url: string | null }> = []
  
  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { steamId, url } = result.value
      newIconsMap[steamId] = url
      updates.push({ steam_id: steamId, icon_url: url })
    }
  }

  // 4. Сохраняем новые иконки в базу
  if (updates.length > 0) {
    await Promise.all(
      updates.map(update => 
        supabase
          .from('games')
          .update({ icon_url: update.icon_url })
          .eq('steam_id', update.steam_id)
      )
    )
  }

  // 5. Объединяем существующие и новые иконки
  return { ...Object.fromEntries(existingMap), ...newIconsMap }
})