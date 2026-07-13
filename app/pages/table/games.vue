<!-- Таблица игр -->

<script setup lang="ts">
import { Flex, Icon, Style, Text } from '~/components/atoms';
import { Button, InputText, Masonry, ModalGame, Section } from '~/components/molecules';
import { TOKENS } from '~/tokens';
import { get_color } from '~/utilities';
import { use_admin } from '~/composables/use_admin';
import type { Game } from '~/types/game';

const SUPABASE = useSupabaseClient();

// Кэш списка на сутки (persist между перезагрузками в рамках сессии)
const CACHE_KEY = "game-list-with-icons";
const CACHE_TTL = 86400000; // 24ч

const read_session_cache = (): Game[] | undefined => {
  if (import.meta.server) return undefined
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return undefined
    const { ts, data } = JSON.parse(raw) as { ts: number; data: Game[] }
    if (Date.now() - ts < CACHE_TTL) return data
  } catch { /* ignore */ }
  return undefined
};

const write_session_cache = (data: Game[]) => {
  if (import.meta.server) return
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch { /* ignore */ }
};

// Запрос (кэш на сутки в рамках сессии)
const { data: GAMES, pending, error } = useAsyncData<Game[]>(
  "game-list-with-icons",
  async () => {
    // 1. Получаем игры из Supabase
    const { data, error } = await SUPABASE
      .from("games")
      .select("*")
      .order("status").order("started_at").order("title");

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
    const enriched = games.map(game => ({
      ...game,
      icon_url: iconsMap[game.steam_id] || null
    }))
    write_session_cache(enriched)
    return enriched
  },
  {
    // Возвращаем кэш сессии, если он свежее суток
    getCachedData: () => read_session_cache(),
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

// Модальное окно
const selected_game = ref<Game | null>(null);
const is_modal_open = ref(false);
const modal_mode = ref<"view" | "create">("view");

const open_game = (game: Game) => {
  selected_game.value = game;
  modal_mode.value = "view";
  is_modal_open.value = true;
};

const open_create = () => {
  selected_game.value = null;
  modal_mode.value = "create";
  is_modal_open.value = true;
};

const close_modal = () => {
  is_modal_open.value = false;
};

// Админ-доступ (ключ из env ADMIN_KEY)
const { is_admin, set_key, clear: clear_admin, key: admin_key } = use_admin();
const admin_input = ref("");
const show_admin_input = ref(false);

const submit_admin = () => {
  if (admin_input.value.trim()) {
    set_key(admin_input.value.trim());
    show_admin_input.value = false;
    admin_input.value = "";
  }
};

const on_saved = (updated: Game) => {
  if (!GAMES.value) return;
  const idx = GAMES.value.findIndex((g) => g.id === updated.id);
  if (idx !== -1) GAMES.value[idx] = { ...GAMES.value[idx], ...updated };
  selected_game.value = updated;
};

const on_created = (created: Game) => {
  if (!GAMES.value) GAMES.value = [];
  GAMES.value = [created, ...GAMES.value];
};

const on_deleted = (id: number) => {
  if (GAMES.value) GAMES.value = GAMES.value.filter((g) => g.id !== id);
  selected_game.value = null;
};


// Адаптив
const { size } = use_window_size();

const columns = computed(() => {
  switch (size.value) {
    case "xl":
      return 6;

    case "lg":
      return 5;

    case "md":
      return 4;

    case "sm":
      return 3;

    case "xs":
      return 2;

    default:
      return 1;
  }
});
</script>

<template>
  <Section>
    <template #heading>
      <Flex align_items="center" justify_content="space-between" :css="{ width: '100%' }">
        <Flex align_items="center" :gap="16">
          <Icon name="nf-md-table" />Table
        </Flex>
        <!-- Админ-доступ -->
        <Flex align_items="center" :gap="8">
          <template v-if="!is_admin">
            <Button v-if="!show_admin_input" icon @click="show_admin_input = true">
              <Icon name="nf-md-lock" />
            </Button>
            <Flex v-else :gap="8">
              <InputText v-model="admin_input" type="password">Admin key</InputText>
              <Button @click="submit_admin">Войти</Button>
            </Flex>
          </template>
          <template v-else>
            <Text family="body" size="default" color="success_5">Admin mode</Text>
            <Button @click="open_create">
              <Icon name="nf-md-plus" /> Добавить
            </Button>
            <Button @click="clear_admin()">Выйти</Button>
          </template>
        </Flex>
      </Flex>
    </template>



    <div v-if="pending">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <Masonry v-else mode="vertical" :columns="columns">
      <Flex v-for="game in GAMES" :key="game.id" :gap="12" :padding="16" role="button" tabindex="0" :css="{
        borderWidth: 3,
        borderColor: get_color('gray_8'),
        borderStyle: 'solid',
        transition: `border-color ${TOKENS.transition}`,
        cursor: 'pointer',
        hover: {
          borderColor: get_color('accent_5'),
        }
      }" @click="open_game(game)" @keydown.enter="open_game(game)" @keydown.space.prevent="open_game(game)">
        <Flex tag="img" :src="game.icon_url || '/placeholder-icon.png'" alt="game icon" :padding="8" :radius="8" :css="{
          width: 64,
          height: 64,
          objectFit: 'cover',
          backgroundColor: get_color('gray_8'),
        }" />
        <Flex direction="column" :gap="8">
          <Text family="body" size="xs">{{ game.title }}</Text>
          <Flex align_items="center" justify_content="center" :radius="32" :padding="6"
            :css="{ backgroundColor: get_color(get_status(game.status)) }">
            <Text family="body" mono size="default" color="gray_9">{{ game.status }}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Masonry>

    <ModalGame :game="selected_game" :open="is_modal_open" :mode="modal_mode" @close="close_modal" @saved="on_saved"
      @created="on_created" @deleted="on_deleted" />
  </Section>
</template>