import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  console.log("🚀 === SteamGridDB Icons API START ===");
  
  const body = await readBody(event);
  const steamIds: number[] = body?.steam_ids;
  
  console.log("📥 Received steam_ids:", steamIds);
  
  if (!Array.isArray(steamIds) || steamIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "steam_ids must be a non-empty array" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
  const STEAMGRIDDB_KEY = process.env.STEAMGRIDDB_KEY;

  console.log("🔑 Config check:", {
    hasSupabaseUrl: !!SUPABASE_URL,
    hasSecretKey: !!SUPABASE_SECRET_KEY,
    hasSteamGridKey: !!STEAMGRIDDB_KEY,
    secretKeyLength: SUPABASE_SECRET_KEY?.length || 0,
  });

  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw createError({ statusCode: 500, statusMessage: "SUPABASE_URL или SUPABASE_SECRET_KEY не указаны в .env" });
  }
  if (!STEAMGRIDDB_KEY) {
    throw createError({ statusCode: 500, statusMessage: "STEAMGRIDDB_KEY не указан в .env" });
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log("✅ Supabase client created");

  // 1. Проверяем существующие иконки
  console.log("🔍 Step 1: Checking existing icons in database...");
  const { data: existingIcons, error: selectError } = await supabase
    .from("games")
    .select("steam_id, icon_url")
    .in("steam_id", steamIds)
    .not("icon_url", "is", null);

  if (selectError) {
    console.error("❌ SELECT ERROR:", selectError);
    console.error("Error details:", JSON.stringify(selectError, null, 2));
  } else {
    console.log("✅ Existing icons found:", existingIcons?.length || 0);
    console.log("Existing icons data:", existingIcons);
  }

  const existingMap = new Map(
    existingIcons?.map(icon => [icon.steam_id, icon.icon_url]) || []
  );

  // 2. Определяем недостающие
  const missingIds = steamIds.filter(id => !existingMap.has(id));
  console.log(`📋 Step 2: Missing icons count: ${missingIds.length}`);
  console.log("Missing steam_ids:", missingIds);
  
  if (missingIds.length === 0) {
    console.log("✅ All icons already exist, returning early");
    return Object.fromEntries(existingMap);
  }

  // 3. Получаем иконки из SteamGridDB
  console.log("🌐 Step 3: Fetching icons from SteamGridDB...");
  const fetchIcon = async (steamId: number) => {
    console.log(`  🔄 Fetching icon for steam_id: ${steamId}`);
    try {
      const response = await $fetch(`https://www.steamgriddb.com/api/v2/icons/steam/${steamId}`, {
        method: "GET",
        query: { styles: "official", mimes: "image/png" },
        headers: { Authorization: `Bearer ${STEAMGRIDDB_KEY}` },
      });
      
      console.log(`  📦 SteamGridDB response for ${steamId}:`, {
        success: response.success,
        dataLength: response.data?.length || 0,
      });
      
      if (response.success && response.data?.length > 0) {
        const sorted = response.data.sort((a, b) => b.score - a.score);
        console.log(`  ✅ Found icon for ${steamId}:`, sorted[0].url);
        return { steamId, url: sorted[0].url };
      }
      console.log(`  ⚠️ No icons found for ${steamId}`);
      return { steamId, url: null };
    } catch (error) {
      console.error(`  ❌ SteamGridDB error for ${steamId}:`, error);
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

  console.log(`📊 Step 4: Prepared ${updates.length} updates`);
  console.log("Updates to save:", updates);

  // 4. Сохраняем в базу
  if (updates.length > 0) {
    console.log("💾 Step 5: Saving to database...");
    
    for (const update of updates) {
      console.log(`  🔄 Updating steam_id ${update.steam_id} with icon:`, update.icon_url);
      
      // Сначала проверим, существует ли запись с таким steam_id
      const { data: checkData, error: checkError } = await supabase
        .from("games")
        .select("id, steam_id")
        .eq("steam_id", update.steam_id)
        .single();
      
      if (checkError) {
        console.error(`  ❌ Record check failed for ${update.steam_id}:`, checkError);
        continue;
      }
      
      console.log(`  ✅ Record exists:`, checkData);
      
      // Теперь обновляем
      const { data: updateData, error: updateError } = await supabase
        .from("games")
        .update({ icon_url: update.icon_url })
        .eq("steam_id", update.steam_id)
        .select();
      
      if (updateError) {
        console.error(`  ❌ UPDATE FAILED for ${update.steam_id}:`, updateError);
        console.error("  Error details:", JSON.stringify(updateError, null, 2));
      } else {
        console.log(`  ✅ Successfully updated steam_id ${update.steam_id}:`, updateData);
      }
    }
  }

  console.log("🏁 === SteamGridDB Icons API END ===");
  
  // 5. Возвращаем объединённый результат
  return { ...Object.fromEntries(existingMap), ...newIconsMap };
});