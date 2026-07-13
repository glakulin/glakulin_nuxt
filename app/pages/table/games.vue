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
  
  console.log("🌐 Loading icons for:", toLoad);
  toLoad.forEach(id => loadingIcons.value.add(id));
  
  try {
    const iconsMap = await $fetch('/api/steamgriddb/icons', {
      method: 'POST',
      body: { steam_ids: toLoad }
    }) as Record<number, string | null>;
    
    console.log("📥 Got icons:", iconsMap);
    
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
    console.error("❌ Failed to load icons:", e);
    toLoad.forEach(id => loadingIcons.value.delete(id));
  }
};

// Создаём observer СРАЗУ, не в onMounted
const visibleElements = new Map<Element, number>();
let batchTimeout: ReturnType<typeof setTimeout> | null = null;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const steamId = visibleElements.get(entry.target);
      if (!steamId) return;
      
      if (entry.isIntersecting && !loadedIcons.value.has(steamId)) {
        console.log("👁️ Element visible:", steamId);
        if (!batchTimeout) {
          batchTimeout = setTimeout(() => {
            const visibleIds = Array.from(visibleElements.values())
              .filter(id => !loadedIcons.value.has(id));
            loadVisibleIcons(visibleIds);
            batchTimeout = null;
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

// Ref-функция для v-for — вызывается, когда элемент появляется в DOM
const setRef = (steamId: number) => (el: any) => {
  const element = el?.$el || el; // Берём корневой DOM-элемент, если это компонент
  if (element instanceof Element) {
    console.log("📌 Registering element for steam_id:", steamId);
    observer.observe(element);
    visibleElements.set(element, steamId);
  } else {
    console.warn("⚠️ Could not get DOM element for steam_id:", steamId, el);
  }
};

onUnmounted(() => {
  observer.disconnect();
  if (batchTimeout) clearTimeout(batchTimeout);
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
    <Masonry v-else mode="vertical" :columns="4" :gap="32">
      <Flex 
        v-for="game in GAMES" 
        :key="game.id"
        :ref="setRef(game.steam_id)"
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