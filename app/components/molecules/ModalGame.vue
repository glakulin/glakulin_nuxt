<!-- Модальное окно с деталями игры -->

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Flex, Icon, Style, Text } from "../atoms";
import { Button, InputText, LinkText } from "./";
import { TOKENS } from "~/tokens";
import { get_color, get_rem } from "~/utilities";
import { use_admin } from "~/composables/use_admin";
import type { Game } from "~/types/game";

// Свойства
const props = defineProps<{
  game: Game | null; // Игра для отображения (null в режиме создания)
  open?: boolean; // Открыто ли окно
  mode?: "view" | "create"; // Режим: просмотр/редактирование или создание
}>();

// События
const emit = defineEmits<{
  close: []; // Закрыть окно
  saved: [game: Game]; // Игра обновлена
  created: [game: Game]; // Игра создана
  deleted: [id: number]; // Игра удалена
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

// Подгружаем логотип при открытии (только в режиме просмотра/редактирования)
watch(() => props.open, async (is_open) => {
  if (!is_open || !props.game || props.mode === "create") return;
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

// --- Режим редактирования (только для админа) ---
const { is_admin, auth_header } = use_admin();
const is_editing = ref(false);
const saving = ref(false);
const deleting = ref(false);
const error_msg = ref<string | null>(null);

// Локальная копия полей для редактирования
const form = reactive<{
  title: string;
  steam_id: string;
  status: Game["status"];
  started_at: string;
  completed_at: string;
  dropped_at: string;
  playlist: string;
}>({
  title: "",
  steam_id: "",
  status: "planned",
  started_at: "",
  completed_at: "",
  dropped_at: "",
  playlist: "",
});

const status_options: Game["status"][] = ["playing", "planned", "completed", "dropped"];

// При открытии/смене игры сбрасываем режим и заполняем форму
watch(
  () => [props.open, props.game?.id, props.mode],
  () => {
    error_msg.value = null;
    if (props.mode === "create") {
      is_editing.value = true;
      Object.assign(form, {
        title: "",
        steam_id: "",
        status: "planned" as Game["status"],
        started_at: "",
        completed_at: "",
        dropped_at: "",
        playlist: "",
      });
    } else {
      is_editing.value = false;
      if (props.game) {
        form.title = props.game.title ?? "";
        form.steam_id = String(props.game.steam_id ?? "");
        form.status = props.game.status ?? "planned";
        form.started_at = props.game.started_at ?? "";
        form.completed_at = props.game.completed_at ?? "";
        form.dropped_at = props.game.dropped_at ?? "";
        form.playlist = props.game.playlist ?? "";
      }
    }
  },
  { immediate: true }
);

const save = async () => {
  saving.value = true;
  error_msg.value = null;
  const payload: Partial<Game> = {
    title: form.title,
    steam_id: Number(form.steam_id),
    status: form.status,
    started_at: form.started_at || undefined,
    completed_at: form.completed_at || undefined,
    dropped_at: form.dropped_at || undefined,
    playlist: form.playlist || undefined,
  };
  try {
    if (props.mode === "create") {
      const created = await $fetch<Game>("/api/games", {
        method: "POST",
        body: payload,
        headers: auth_header.value,
      });
      emit("created", created);
      emit("close");
    } else {
      if (!props.game) return;
      const updated = await $fetch<Game>(`/api/games/${props.game.id}`, {
        method: "PATCH",
        body: payload,
        headers: auth_header.value,
      });
      is_editing.value = false;
      emit("saved", updated);
    }
  } catch (e: any) {
    error_msg.value = e?.data?.statusMessage || e?.message || "Ошибка сохранения";
  } finally {
    saving.value = false;
  }
};

const remove = async () => {
  if (!props.game) return;
  if (!confirm(`Удалить игру «${props.game.title}»?`)) return;
  deleting.value = true;
  error_msg.value = null;
  try {
    await $fetch(`/api/games/${props.game.id}`, {
      method: "DELETE",
      headers: auth_header.value,
    });
    emit("deleted", props.game.id);
    emit("close");
  } catch (e: any) {
    error_msg.value = e?.data?.statusMessage || e?.message || "Ошибка удаления";
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Flex
      v-if="open && (game || mode === 'create')"
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

        <!-- Кнопки админа (edit/delete) — только в режиме просмотра -->
        <Flex
          v-if="is_admin && mode !== 'create' && !is_editing"
          :css="{ position: 'absolute', top: 12, right: 56, gap: 8 }"
        >
          <Button
            background="gray_8"
            color="gray_3"
            background_hover="gray_7"
            color_hover="gray_3"
            icon
            size="sm"
            @click="is_editing = true"
          >
            <Icon name="nf-md-pencil" />
          </Button>
          <Button
            background="gray_8"
            color="error_3"
            background_hover="error_5"
            color_hover="gray_1"
            icon
            size="sm"
            :disabled="deleting"
            @click="remove"
          >
            <Icon name="nf-md-delete" />
          </Button>
        </Flex>

        <!-- Кнопки сохранения (в режиме редактирования или создания) -->
        <Flex
          v-if="is_admin && (is_editing || mode === 'create')"
          :css="{ position: 'absolute', top: 12, right: 56, gap: 8 }"
        >
          <Button
            background="success_5"
            color="gray_1"
            background_hover="success_4"
            icon
            size="sm"
            :disabled="saving"
            @click="save"
          >
            <Icon name="nf-md-check" />
          </Button>
          <Button
            background="gray_8"
            color="gray_3"
            background_hover="gray_7"
            color_hover="gray_3"
            icon
            size="sm"
            :disabled="saving"
            @click="emit('close')"
          >
            <Icon name="nf-md-close" />
          </Button>
        </Flex>

        <!-- Логотип (скрыт в режиме создания) -->
        <Flex v-if="mode !== 'create'" :css="{ minHeight: 128, alignSelf: 'flex-start'}">
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
              :src="logo_url || game?.icon_url || '/placeholder-icon.png'"
              :alt="`${game?.title ?? ''} logo`"
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
          <InputText
            v-if="is_admin && (is_editing || mode === 'create')"
            v-model="form.title"
            placeholder="Title"
          />
          <Text v-else family="heading" size="lg" color="gray_1">{{ game?.title }}</Text>

          <Flex v-if="is_admin && (is_editing || mode === 'create')" align_items="center" :gap="8">
            <Text family="body" size="sm" color="gray_4">Status</Text>
            <Style tag="select" v-model="form.status" :css="{ background: get_color('gray_8'), color: get_color('gray_1'), border: `${get_rem(1)} solid ${get_color('gray_7')}`, borderRadius: 8, padding: '4px 8px' }">
              <option v-for="s in status_options" :key="s" :value="s">{{ s }}</option>
            </Style>
          </Flex>
          <Flex v-else align_items="center" justify_content="center" :radius="32" :padding="[8, 32]" :css="{ alignSelf: 'flex-start', backgroundColor: get_color(status_color) }">
            <Text family="body" mono size="md" color="gray_9">{{ game?.status }}</Text>
          </Flex>
        </Flex>

        <!-- Детали -->
        <Flex direction="column" :gap="12">
          <Flex justify_content="space-between" :css="{ borderBottom: `${get_rem(1)} solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Steam ID</Text>
            <InputText
              v-if="is_admin && (is_editing || mode === 'create')"
              v-model="form.steam_id"
              placeholder="Steam ID"
              :css="{ width: 160 }"
            />
            <LinkText v-else :href="`https://store.steampowered.com/app/${game!.steam_id}/`" color="accent_3" color_hover="accent_1">{{ game!.steam_id }}</LinkText>
          </Flex>
          <Flex justify_content="space-between" :css="{ borderBottom: `${get_rem(1)} solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Started</Text>
            <InputText
              v-if="is_admin && (is_editing || mode === 'create')"
              v-model="form.started_at"
              placeholder="Started"
              :css="{ width: 200 }"
            />
            <Text v-else-if="game?.started_at" family="body" mono size="sm" color="gray_1">{{ game.started_at }}</Text>
            <Text v-else family="body" size="sm" color="gray_6">—</Text>
          </Flex>
          <Flex justify_content="space-between" :css="{ borderBottom: `${get_rem(1)} solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Completed</Text>
            <InputText
              v-if="is_admin && (is_editing || mode === 'create')"
              v-model="form.completed_at"
              placeholder="Completed"
              :css="{ width: 200 }"
            />
            <Text v-else-if="game?.completed_at" family="body" mono size="sm" color="gray_1">{{ game.completed_at }}</Text>
            <Text v-else family="body" size="sm" color="gray_6">—</Text>
          </Flex>
          <Flex justify_content="space-between" :css="{ borderBottom: `${get_rem(1)} solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Dropped</Text>
            <InputText
              v-if="is_admin && (is_editing || mode === 'create')"
              v-model="form.dropped_at"
              placeholder="Dropped"
              :css="{ width: 200 }"
            />
            <Text v-else-if="game?.dropped_at" family="body" mono size="sm" color="gray_1">{{ game.dropped_at }}</Text>
            <Text v-else family="body" size="sm" color="gray_6">—</Text>
          </Flex>
          <Flex justify_content="space-between" :css="{ borderBottom: `${get_rem(1)} solid ${get_color('gray_8')}`, paddingBottom: 8 }">
            <Text family="body" size="sm" color="gray_4">Playlist</Text>
            <InputText
              v-if="is_admin && (is_editing || mode === 'create')"
              v-model="form.playlist"
              placeholder="Playlist URL"
              :css="{ width: 240 }"
            />
            <LinkText v-else-if="game?.playlist" :href="game.playlist" color="accent_3" color_hover="accent_1">playlist</LinkText>
            <Text v-else family="body" size="sm" color="gray_6">—</Text>
          </Flex>
        </Flex>

        <Text v-if="error_msg" family="body" size="sm" color="error_3">{{ error_msg }}</Text>
      </Flex>
    </Flex>
  </Teleport>
</template>
