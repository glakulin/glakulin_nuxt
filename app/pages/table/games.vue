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

const { data: GAMES, pending, error } = useAsyncData<Game[]>(
  "game-list",
  async () => {
    const { data, error } = await SUPABASE
      .from("games")
      .select("*")
      .order("status").order("started_at");

    if (error) throw new Error(error.message);
    return (data as Game[]) || [];
  }
);

const loadedIcons = ref<Set<number>>(new Set());
const loadingIcons = ref<Set<number>>(new Set());

const loadVisibleIcons = async (visibleSteamIds: number[]) => {
  const toLoad = visibleSteamIds.filter(
    id => !loadedIcons.value.has(id) && !loadingIcons.value.has(id)
  );
  
  if (toLoad.length === 0) return;
  
  toLoad.forEach(id => loadingIcons.value.add(id));
  
  try {
    const iconsMap = await $fetch('/api/steamgriddb/icons', {
      method: 'POST',
      body: { steam_ids: toLoad }
    }) as Record<number, string | null>;
    
    if (GAMES.value) {
      GAMES.value = GAMES.value.map(game => {
        if (iconsMap[game.steam_id] !== undefined) {
          return { 
            ...game, 
            icon_url: iconsMap[game.steam_id] ?? null 
          };
        }
        return game;
      });
    }
    
    toLoad.forEach(id => {
      loadedIcons.value.add(id);
      loadingIcons.value.delete(id);
    });
  } catch (e) {
    console.error("Failed to load icons:", e);
    toLoad.forEach(id => loadingIcons.value.delete(id));
  }
};

const observer = ref<IntersectionObserver | null>(null);
const visibleElements = ref<Map<Element, number>>(new Map());
const batchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const steamId = visibleElements.value.get(entry.target);
        if (!steamId) return;
        
        if (entry.isIntersecting && !loadedIcons.value.has(steamId)) {
          if (!batchTimeout.value) {
            batchTimeout.value = setTimeout(() => {
              const visibleIds = Array.from(visibleElements.value.values())
                .filter(id => !loadedIcons.value.has(id));
              loadVisibleIcons(visibleIds);
              batchTimeout.value = null;
            }, 100);
          }
        }
      });
    },
    {
      rootMargin: '200px',
      threshold: 0.1
    }
  );
  
  // ВАЖНО: Регистрируем уже отрисованные элементы после onMounted
  registerAllElements();
});

onUnmounted(() => {
  observer.value?.disconnect();
  if (batchTimeout.value) clearTimeout(batchTimeout.value);
});

// Функция регистрации всех элементов из DOM
const registerAllElements = () => {
  if (!observer.value || !GAMES.value) return;
  
  const container = document.querySelector('[data-game-list]');
  if (!container) return;
  
  const items = container.querySelectorAll('[data-steam-id]');
  items.forEach(el => {
    const steamId = Number(el.getAttribute('data-steam-id'));
    if (steamId && !visibleElements.value.has(el)) {
      observer.value!.observe(el);
      visibleElements.value.set(el, steamId);
    }
  });
};

// Следим за изменением списка игр — регистрируем новые элементы
watch(GAMES, () => {
  nextTick(() => registerAllElements());
});

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
    <Masonry v-else mode="vertical" :columns="4" :gap="32" data-game-list>
      <Flex 
        v-for="game in GAMES" 
        :key="game.id"
        :data-steam-id="game.steam_id"
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