<!-- Компонент для ссылок -->

<script setup lang="ts">
import { TOKENS, type Color_Scheme } from "~/tokens";
import { get_color } from "~/utilities";
import { Flex, Icon, Text } from "../atoms";
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = defineProps<{
  color?: Color_Scheme;
  color_hover?: Color_Scheme;
  href?: string;
  css?: Css_Rule;
}>();

// 1. Вычисляем, является ли ссылка внешней
const is_external = computed(() => {
  if (!props.href) return false;
  // Проверяем стандартные внешние протоколы
  return /^(https?:)?\/\//.test(props.href) || props.href.startsWith('mailto:') || props.href.startsWith('tel:');
});

// Свойства в стили
const css_rule = computed<Css_Rule>(() => {
  const base_color = props.color ? get_color(props.color) : "inherit";
  const hover_color = props.color_hover ? get_color(props.color_hover) : "inherit";

  return {
    // 2. Добавляем flex для выравнивания иконки и текста
    color: base_color,
    transition: `color ${TOKENS.transition}`,
    cursor: "pointer",
    hover: {
      color: hover_color
    },
    ...props.css
  };
});
</script>

<template>
  <!-- 3. Автоматически открываем внешние ссылки в новой вкладке -->
  <NuxtLink 
    :href="props.href" 
    :target="is_external ? '_blank' : undefined"
    :rel="is_external ? 'noopener noreferrer' : undefined"
  >
    <Flex inline align_items="center" :gap="4" :css="css_rule" v-bind="$attrs">
      <slot />
      <Text v-if="is_external" family="body" size="default"><Icon name="nf-fa-external_link" /></Text>
    </Flex>
  </NuxtLink>
</template>