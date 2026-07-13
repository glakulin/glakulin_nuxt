<!-- Модальное окно с деталями игры -->

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Flex, Icon, Style, Text } from "../atoms";
import { Button, LinkText } from "./";
import { TOKENS } from "~/tokens";
import { get_color } from "~/utilities";
import type { Game } from "~/types/game";

// Свойства
const props = defineProps<{
  game: Game | null; // Игра для отображения
  open?: boolean; // Открыто ли окно
}>();

// События
const emit = defineEmits<{
  close: []; // Закрыть окно
}>();

// Логотип (подгружается при открытии)
const logo_url = ref<string | null>(null);
const logo_loading = ref(false);

// Статусы
const status_color = computed(() => {
  switch (props.game?.status) {
    case "playing": return "warning_5";
    case "planned": return "info_5";
    case "completed": return "success_5";
    case "dropped": return "error_5";
    default: return "gray_5";
  }
});

// Подгружаем логотип при открытии
watch(() => props.open, async (is_open) => {
  if (!is_open || !props.game) return;
  logo_url.value = null;
  logo_loading.value = true;
  try {
    const map = await $fetch<Record<number, string | null>>("/api/steamgriddb/logos", {
      method: "POST",
      body: { steam_ids: [props.game.steam_id] },
    });
    logo_url.value = map[props.game.steam_id] || null;
  } catch (e) {
    console.error("Failed to fetch logo:", e);
    logo_url.value = null;
  } finally {
    logo_loading.value = false;
  }
});

// Закрытие по Escape
const on_key = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close");
};
</script>

<template>
  <Teleport to="body">
    <Flex
      v-if="open && game"
      tag="div"
      align_items="center"
      justify_content="center"
      :padding="16"
      :css="{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      }"
      @click.self="emit('close')"
      @keydown="on_key"
      tabindex="-1"
    >
      <Flex
        direction="column"
        :gap="24"
        :padding="64"
        :css="{
          position: 'relative',
          width: '100%',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: get_color('gray_9'),
          borderRadius: 16,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: get_color('gray_7'),
          boxShadow: `0 8px 32px ${get_color('gray_9')}`,
        }"
      >
        <!-- Кнопка закрытия -->
        <Button
          background="gray_8"
          color="gray_3"
          background_hover="gray_7"
          color_hover="gray_3"
          icon
          :css="{
            position: 'absolute',
            top: 12,
            right: 12
          }"
          @click="emit('close')"
          size="sm"
        >
          <Icon name="nf-md-close" />
        </Button>

        <!-- Логотип -->
        <Flex :css="{ minHeight: 128, alignSelf: 'flex-start'}">
          <Flex
            v-if="logo_loading"
            align_items="center"
            :css="{
              width: '100%',
              height: 128,
              backgroundColor: get_color('gray_8'),
              borderRadius: 8,
              color: get_color('gray_5'),
            }"
          >
            <Icon name="nf-md-loading" :css="{ animation: 'spin 1s linear infinite' }" />
          </Flex>
          <Flex
            v-else
            align_items="center"
            :css="{
              width: '100%',
              minHeight: 96,
              padding: 16,
              backgroundColor: get_color('gray_8'),
              borderRadius: 8
            }"
          >
            <Style
              tag="img"
              :src="logo_url || game.icon_url || '/placeholder-icon.png'"
              :alt="`${game.title} logo`"
              :css="{
                maxWidth: '100%',
                maxHeight: 128,
                objectFit: 'contain',
              }"
            />
          </Flex>
        </Flex>

        <!-- Заголовок -->
        <Flex direction="column" :gap="16">
          <Text family="heading" size="lg" color="gray_1">{{ game.title }}</Text>
          <Flex align_items="center" justify_content="center" :radius="32" :padding="[8, 32]" :css="{ alignSelf: 'flex-start', backgroundColor: get_color(status_color) }">
            <Text family="body" mono size="md" color="gray_9">{{ game.status }}</Text>
          </Flex>
        </Flex>

        <!-- Детали -->
        <Flex direction="column" :gap="12">
          <Flex justify_content="space-between" :css="{ borderBottom: `1px solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Steam ID</Text>
            <LinkText :href="`https://store.steampowered.com/app/${game.steam_id}/`" color="accent_3" color_hover="accent_1">{{ game.steam_id }}</LinkText>
          </Flex>
          <Flex v-if="game.started_at" justify_content="space-between" :css="{ borderBottom: `1px solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Started</Text>
            <Text family="body" mono size="sm" color="gray_1">{{ game.started_at }}</Text>
          </Flex>
          <Flex v-if="game.completed_at" justify_content="space-between" :css="{ borderBottom: `1px solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Completed</Text>
            <Text family="body" mono size="sm" color="gray_1">{{ game.completed_at }}</Text>
          </Flex>
          <Flex v-if="game.dropped_at" justify_content="space-between" :css="{ borderBottom: `1px solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Dropped</Text>
            <Text family="body" mono size="sm" color="gray_1">{{ game.dropped_at }}</Text>
          </Flex>
          <Flex v-if="game.playlist" justify_content="space-between" :css="{ borderBottom: `1px solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Playlist</Text>
            <LinkText :href="game.playlist" color="accent_3" color_hover="accent_1">playlist</LinkText>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Teleport>
</template>
