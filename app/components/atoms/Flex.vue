<!-- Компонент для flexbox -->

<script setup lang="ts">
import type { CSSProperties as CSSP } from "vue";
import { type Number_Rem } from "~/utilities";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // Тег

  inline?: boolean; // inline или нет
  direction?: CSSP["flexDirection"]; // Направление
  wrap?: CSSP["flexWrap"]; // Перенос

  justify_items?: CSSP["justifyItems"]; // Выравнивание элементов по горизонтали
  align_items?: CSSP["alignItems"]; // Выравнивание элементов по вертикали
  justify_content?: CSSP["justifyContent"]; // Выравнивание контента по горизонтали
  align_content?: CSSP["alignContent"]; // Выравнивание контента по вертикали

  gap?: Number_Rem; // Промежуток
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

  alignItems: props.align_items,
  alignContent: props.align_content,
  justifyItems: props.justify_items,
  justifyContent: props.justify_content,

  gap: props.gap,
  padding: props.padding,
  borderRadius: props.radius
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