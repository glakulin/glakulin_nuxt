<!-- Карточка скилла/проекта -->

<script setup lang="ts">
import { NuxtLink } from "#components";
import { Flex, Icon, Text, Style } from "~/components/atoms";
import { group_icons } from "~/static";
import { TOKENS } from "~/tokens";
import { get_color, get_rem } from "~/utilities";
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = defineProps<{
  name: string; // Название
  icon: string; // Иконка
  description: string; // Описание
  url: string; // Ссылка
  group?: string; // Группа (опционально)
  thumbnail?: string; // Превью (опционально)
  css?: Css_Rule; // Дополнительные стили
}>();

// Иконка группы на фоне
const group_icon = computed(() => props.group ? group_icons[props.group] : undefined);
</script>

<template>
  <Flex :tag="NuxtLink" :href="url" target="_blank" rel="noopener noreferrer"
    direction="column" :gap="12" :padding="16" :css="{
      '--card-color': get_color('gray_8'),
      position: 'relative',
      overflow: 'hidden',
      border: `${get_rem(2)} solid var(--card-color)`,
      cursor: 'pointer',
      transition: `border-color ${TOKENS.transition}, color ${TOKENS.transition}`,
      hover: {
        '--card-color': get_color('accent_2'),
      },
      ...props.css
    }">
    <!-- Превью -->
    <Flex v-if="thumbnail" :css="{
      width: '100%',
      aspectRatio: '2 / 1',
      background: get_color('gray_9'),
      border: `${get_rem(1)} solid ${get_color('gray_8')}`,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center'
    }">
      <Style tag="img" :src="thumbnail" :alt="name" :css="{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }" />
    </Flex>

    <!-- Заголовок -->
    <Text family="heading" size="default">
      <Flex :gap="8">
        <Icon :name="icon" />{{ name }}
      </Flex>
    </Text>

    <!-- Описание -->
    <Text family="body" size="xs">{{ description }}</Text>

    <!-- Группа -->
    <Text v-if="group" family="body" size="default"
      :css="{ color: 'var(--card-color)', transition: `color ${TOKENS.transition}` }">
      {{ group }}
    </Text>

    <!-- Иконка группы на фоне -->
    <Icon v-if="group_icon" :name="group_icon" :css="{
      position: 'absolute',
      right: 16,
      top: 16,
      fontSize: 64,
      color: 'var(--card-color)',
      pointerEvents: 'none',
      filter: 'blur(2px)',
      zIndex: -1,
      transition: `color ${TOKENS.transition}`
    }" />
  </Flex>
</template>
