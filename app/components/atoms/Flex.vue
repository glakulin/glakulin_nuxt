<!-- Компонент для flexbox -->

<script setup lang="ts">
import type { CSSProperties as CSSP } from "vue";
import { use_css } from "~/composables/use_css";
import { get_rem, type Number_Rem } from "~/utilities";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // Тег

  inline?: boolean; // inline или нет
  direction?: CSSP["flexDirection"]; // Направление
  wrap?: CSSP["flexWrap"]; // Перенос
  basis?: CSSP["flexBasis"]; // База
  grow?: CSSP["flexGrow"]; // Рост
  shrink?: CSSP["flexShrink"]; // Уменьшение

  gap?: number; // Промежуток
  padding?: Number_Rem; // Отступы
  radius?: Number_Rem; // Скругление
}>(), {
  // Значения по умолчанию
  tag: "div",
  inline: false
});

// Свойства в стили
const css = use_css();
const class_name = computed(() => css({
  display: props.inline ? "inline-flex" : "flex",
  flexDirection: props.direction,
  flexWrap: props.wrap,
  flexBasis: props.basis,
  flexGrow: props.grow,
  flexShrink: props.shrink,

  gap: props.gap,
  padding: props.padding ? get_rem(props.padding) : undefined,
  borderRadius: props.radius ? get_rem(props.radius) : undefined
}));
</script>

<template>
  <component
    :is="props.tag"
    :class="class_name"
  >
    <slot />
  </component>
</template>