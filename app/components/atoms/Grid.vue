<!-- Компонент для gridbox -->

<script setup lang="ts">
import type { CSSProperties as CSSP } from "vue";
import { type Number_Rem } from "~/utilities";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // Тег

  inline?: boolean; // inline или нет
  template_columns?: CSSP["gridTemplateColumns"]; // Колонки
  template_rows?: CSSP["gridTemplateRows"]; // Строки
  template_areas?: CSSP["gridTemplateAreas"]; // Области
  auto_flow?: CSSP["gridAutoFlow"]; // Поток
  auto_columns?: CSSP["gridAutoColumns"]; // Авто-колонки
  auto_rows?: CSSP["gridAutoRows"]; // Авто-строки

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
  display: props.inline ? "inline-grid" : "grid",
  gridTemplateColumns: props.template_columns,
  gridTemplateRows: props.template_rows,
  gridTemplateAreas: props.template_areas,
  gridAutoFlow: props.auto_flow,
  gridAutoColumns: props.auto_columns,
  gridAutoRows: props.auto_rows,

  justifyItems: props.justify_items,
  alignItems: props.align_items,
  justifyContent: props.justify_content,
  alignContent: props.align_content,

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
