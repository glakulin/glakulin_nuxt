<script setup lang="ts">
import { Flex, Icon, Style, Text } from '~/components/atoms';
import { Masonry, Section } from '~/components/molecules';
import { get_color } from '~/utilities';

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
  icon_url: string | null;
};

// Подключение
const SUPABASE = useSupabaseClient();

// Загружаем только базовые данные игр (без иконок)
const { data: GAMES, pending, error } = useAsyncData<Game[]>(
  "game-list",
  async () => {
    const { data, error } = await SUPABASE
      .from("games")
      .select("*")
      .order("status").order("started_at");

    if (error) throw new Error(error.message)
    return (data as Game[]) || []
  }
);

// Состояние для отслеживания загруженных иконок
const loadedIcons = ref<Set<number>>(new Set())
const loadingIcons = ref<Set<number>>(new Set())

// Функция для загрузки иконок для видимых элементов
// Функция для загрузки иконок для видимых элементов
const loadVisibleIcons = async (visibleSteamIds: number[]) => {
  // Фильтруем только те, которые ещё не загружены и не загружаются
  const toLoad = visibleSteamIds.filter(
    id => !loadedIcons.value.has(id) && !loadingIcons.value.has(id)
  )
  
  if (toLoad.length === 0) return
  
  // Добавляем в статус "загружается"
  toLoad.forEach(id => loadingIcons.value.add(id))
  
  try {
    const iconsMap = await $fetch('/api/steamgriddb/icons', {
      method: 'POST',
      body: { steam_ids: toLoad }
    }) as Record<number, string | null>
    
    // Обновляем данные игр
    if (GAMES.value) {
      GAMES.value = GAMES.value.map(game => {
        if (iconsMap[game.steam_id] !== undefined) {
          // Явно приводим undefined к null
          return { 
            ...game, 
            icon_url: iconsMap[game.steam_id] ?? null 
          }
        }
        return game
      })
    }
    
    // Отмечаем как загруженные
    toLoad.forEach(id => {
      loadedIcons.value.add(id)
      loadingIcons.value.delete(id)
    })
  } catch (e) {
    console.error("Failed to load icons:", e)
    toLoad.forEach(id => loadingIcons.value.delete(id))
  }
}

// Intersection Observer для отслеживания видимости
const observer = ref<IntersectionObserver | null>(null)
const visibleElements = ref<Map<Element, number>>(new Map()) // element -> steam_id
const batchTimeout = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const steamId = visibleElements.value.get(entry.target)
        if (!steamId) return
        
        if (entry.isIntersecting) {
          // Элемент стал видимым
          if (!loadedIcons.value.has(steamId)) {
            // Добавляем в очередь на загрузку
            if (!batchTimeout.value) {
              batchTimeout.value = setTimeout(() => {
                const visibleIds = Array.from(visibleElements.value.values())
                  .filter(id => !loadedIcons.value.has(id))
                loadVisibleIcons(visibleIds)
                batchTimeout.value = null
              }, 100) // Задержка 100ms для батчинга
            }
          }
        }
      })
    },
    {
      rootMargin: '200px', // Начинаем загружать за 200px до появления
      threshold: 0.1
    }
  )
})

onUnmounted(() => {
  observer.value?.disconnect()
  if (batchTimeout.value) clearTimeout(batchTimeout.value)
})

// Функция для регистрации элемента
const registerElement = (el: Element | null, steamId: number) => {
  if (el && observer.value) {
    observer.value.observe(el)
    visibleElements.value.set(el, steamId)
  }
}

// Функция для отмены регистрации
const unregisterElement = (el: Element | null) => {
  if (el && observer.value) {
    observer.value.unobserve(el)
    visibleElements.value.delete(el)
  }
}

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
</script>

<template>
  <Section>
    <template #heading><Icon name="nf-md-table" />Table</template>
    <div v-if="pending">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <Masonry mode="vertical" :columns="4" :gap="32">
      <Flex v-for="game in GAMES" :key="game.id" :gap="12" :padding="16" :css="{
        borderWidth: 1,
        borderColor: get_color('gray_8'),
        borderStyle: 'solid'
      }">
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