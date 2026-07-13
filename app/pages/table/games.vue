<!-- Таблица игр -->

<script setup lang="ts">
import { Flex, Icon, Style, Text } from '~/components/atoms';
import { Masonry, Section } from '~/components/molecules';
import { get_color } from '~/utilities';

interface Game {
  id: number;
  title: string;
  started_at?: string;
  completed_at?: string;
  dropped_at?: string;
  steam_id: number;
  status: "playing" | "planned" | "completed" | "dropped";
  playlist?: string;
  icon_url: string | null;
};

const SUPABASE = useSupabaseClient();

// Запрос
const { data: GAMES, pending, error } = useAsyncData<Game[]>(
  "game-list-with-icons",
  async () => {
    // 1. Получаем игры из Supabase
    const { data, error } = await SUPABASE
      .from("games")
      .select("*")
      .order("status").order("started_at");

    if (error) throw new Error(error.message)
    if (!data) return []

    const games = data as Game[]
    if (games.length === 0) return []

    // 2. Получаем иконки пакетно через наш серверный API
    const steamIds = games.map(g => g.steam_id)
    let iconsMap: Record<number, string | null> = {}
    
    try {
      iconsMap = await $fetch('/api/steamgriddb/icons', {
        method: 'POST',
        body: { steam_ids: steamIds }
      })
    } catch (e) {
      console.error("Failed to fetch icons:", e)
    }

    // 3. Обогащаем игры иконками
    return games.map(game => ({
      ...game,
      icon_url: iconsMap[game.steam_id] || null
    }))
  }
);

const get_status = (status: Game["status"]) => {
  switch (status) {
    case "playing": return "warning_5";
    case "planned": return "info_5";
    case "completed": return "success_5";
    case "dropped": return "error_5";
  }
};
</script>

<template>
  <Section>
    <template #heading><Icon name="nf-md-table" />Table</template>
    <div v-if="pending">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <Masonry v-else mode="vertical" :columns="4" :gap="32">
      <Flex 
        v-for="game in GAMES" 
        :key="game.id"
        :gap="12" 
        :padding="16" 
        :css="{
          borderWidth: 1,
          borderColor: get_color('gray_8'),
          borderStyle: 'solid'
        }"
      >
        <Style tag="img" 
            :src="game.icon_url || '/placeholder-icon.png'"
            alt="game icon"
            :css="{
              width: 48,
              height: 48,
              objectFit: 'cover',
              backgroundColor: get_color('gray_8')
            }" 
          />
        <Flex align_items="flex-start" direction="column" :gap="8">
          {{ game.title }}
          <Flex :padding="4" :css="{ backgroundColor: get_color(get_status(game.status))}" >
            <Text family="body" mono size="default" color="gray_9">{{ game.status }}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Masonry>
  </Section>
</template>