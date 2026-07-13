import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const steamIds: number[] = body?.steam_ids;
  
  if (!Array.isArray(steamIds) || steamIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "steam_ids must be a non-empty array" });
  }

  // Читаем напрямую из .env, минуя runtimeConfig
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
  const STEAMGRIDDB_KEY = process.env.STEAMGRIDDB_KEY;

  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw createError({ statusCode: 500, statusMessage: "SUPABASE_URL или SUPABASE_SECRET_KEY не указаны в .env" });
  }
  if (!STEAMGRIDDB_KEY) {
    throw createError({ statusCode: 500, statusMessage: "STEAMGRIDDB_KEY не указан в .env" });
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // 1. Проверяем существующие иконки
  const { data: existingIcons, error: selectError } = await supabase
    .from("games")
    .select("steam_id, icon_url")
    .in("steam_id", steamIds)
    .not("icon_url", "is", null);

  if (selectError) console.error("Supabase select error:", selectError);

  const existingMap = new Map(
    existingIcons?.map(icon => [icon.steam_id, icon.icon_url]) || []
  );

  // 2. Определяем недостающие
  const missingIds = steamIds.filter(id => !existingMap.has(id));
  
  if (missingIds.length === 0) {
    return Object.fromEntries(existingMap);
  }

  // 3. Получаем иконки из SteamGridDB
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
      console.warn(`⚠️ SteamGridDB error for ${steamId}:`, error);
      return { steamId, url: null };
    }
  };

  const results = await Promise.allSettled(missingIds.map(fetchIcon));
  
  const newIconsMap: Record<number, string | null> = {};
  const updates: Array<{ steam_id: number; icon_url: string | null }> = [];
  
  for (const result of results) {
    if (result.status === "fulfilled") {
      const { steamId, url } = result.value;
      newIconsMap[steamId] = url;
      updates.push({ steam_id: steamId, icon_url: url });
    }
  }

  // 4. Сохраняем в базу
  if (updates.length > 0) {
    for (const update of updates) {
      const { error } = await supabase
        .from("games")
        .update({ icon_url: update.icon_url })
        .eq("steam_id", update.steam_id);
      
      if (error) console.error(`❌ Update failed for ${update.steam_id}:`, error);
    }
  }

  // 5. Возвращаем объединённый результат
  return { ...Object.fromEntries(existingMap), ...newIconsMap };
});