<script setup lang="ts">
import { Flex, Icon, Text } from '~/components/atoms';
import { Masonry, Section } from '~/components/molecules';
import { get_color } from '~/utilities';
import SGDB from "steamgriddb";

// Тип из таблицы
interface Game {
  id: number;
  title: string;
  started_at?: string;
  completed_at?: string;
  dropped_at?: string;
  steam_id: number;
  status: "playing" | "planned" | "completed" | "dropped";
  playlist?: string;
};

// Подключение
const SUPABASE = useSupabaseClient();

// Запрос
const { data: GAMES, pending, error } = useAsyncData<Game[]>(
  "game-list",
  async () => {
    const { data, error } = await SUPABASE
      .from("games")
      .select("*")
      .order("status").order("started_at");

      if (error) throw new Error(error.message)

      return data as Game[];
  }
);

// Цвет статуса
const get_status = (status: Game["status"]) => {
  switch (status) {
    case "playing":
      return "warning_5";

    case "planned":
      return "info_5";

    case "completed":
      return "success_5";

    case "dropped":
      return "error_5";
  }
};

const client = new SGDB(process.env.STEAMGRIDDB_KEY!);

// Реактивный объект для хранения иконок по steam_id
const icons = ref<Record<string, string | undefined>>({});

// Функция загрузки иконки для конкретной игры
async function loadIcon(steam_id: number) {
  if (icons.value[steam_id] !== undefined) return; // уже загружено
  const url = await client.getIconsBySteamAppId(steam_id);
  icons.value[steam_id] = url[0]?.url.href;
}

// Загружаем иконки для всех игр после монтирования
onMounted(async () => {
  if (GAMES.value) {
    await Promise.all(GAMES.value.map(game => loadIcon(game.steam_id)));
  }
});
</script>

<template>
  <Section>
    <template #heading><Icon name="nf-md-table" />Table</template>
    <div v-if="pending">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <Masonry mode="vertical" :columns="4" :gap="32">
      <Flex v-for="game in GAMES">
        <img 
            v-if="icons[game.steam_id]" 
            :src="icons[game.steam_id]!" 
            alt="game icon" 
            width="32" 
            height="32"
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