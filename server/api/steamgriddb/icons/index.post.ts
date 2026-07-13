// server/api/steamgriddb/icons/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const steamIds: number[] = body?.steam_ids;
  
  if (!Array.isArray(steamIds) || steamIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "steam_ids must be a non-empty array" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
  const STEAMGRIDDB_KEY = process.env.STEAMGRIDDB_KEY;

  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !STEAMGRIDDB_KEY) {
    throw createError({ statusCode: 500, statusMessage: "Missing env variables" });
  }

  // Просто получаем иконки из SteamGridDB, без сохранения в БД
  const fetchIcon = async (steamId: number) => {
    try {
      const response = await $fetch(`https://www.steamgriddb.com/api/v2/icons/steam/${steamId}`, {
        method: "GET",
        query: { styles: "official", mimes: "image/png" },
        headers: { Authorization: `Bearer ${STEAMGRIDDB_KEY}` },
      });
      
      if (response.success && response.data?.length > 0) {
        const sorted = response.data.sort((a, b) => b.score - a.score);
        return { steamId, url: sorted[0].url };
      }
      return { steamId, url: null };
    } catch (error) {
      console.warn(`Failed to fetch icon for ${steamId}:`, error);
      return { steamId, url: null };
    }
  };

  const results = await Promise.allSettled(steamIds.map(fetchIcon));
  
  const iconsMap: Record<number, string | null> = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      iconsMap[result.value.steamId] = result.value.url;
    }
  }

  return iconsMap;
});