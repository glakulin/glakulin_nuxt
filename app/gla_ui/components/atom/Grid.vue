<!-- Компонент для gridbox -->

<script setup lang="ts">
import type { Property } from "csstype"; // Библиотека для типов из css
import { get_nums, type Num_Values } from "~/gla_ui/tokens";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // HTML тег

  inline?: boolean; // inline-grid или просто grid
  columns?: Property.GridTemplateColumns; // Колонки
  rows?: Property.GridTemplateRows; // Строки
  areas?: Property.GridTemplateAreas; // Области
  auto_flow?: Property.GridAutoFlow; // Авто поток
  auto_columns?: Property.GridAutoColumns; // Авто колонки
  auto_rows?: Property.GridAutoRows; // Авто строки

  // Свойства для выравнивания
  align_items?: Property.AlignItems;
  justify_items?: Property.JustifyItems;
  align_content?: Property.AlignContent;
  justify_content?: Property.JustifyContent;

  gap?: Num_Values; // Промежуток
  padding?: Num_Values; // Отступы
  radius?: Num_Values; // Скругление
}>(), {
  // Значения по умолчанию
  tag: "div",
  inline: false,
  columns: undefined,
  rows: undefined,
  areas: undefined,
  auto_flow: "row",
  auto_columns: undefined,
  auto_rows: undefined,
  align_items: "flex-start",
  justify_items: "flex-start",
  align_content: "flex-start",
  justify_content: "flex-start",
  gap: () => [0] as Num_Values,
  padding: () => [0] as Num_Values,
  radius: () => [0] as Num_Values
});

// Обработка свойств
const gap = computed(() => get_nums(props.gap));
const padding = computed(() => get_nums(props.padding));
const radius = computed(() => get_nums(props.radius));
</script>

<template>
  <component
    :is="props.tag"
    class="grid"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
// Стили по свойствам
.grid {
  display: v-bind('props.inline ? "inline-grid" : "grid"');
  grid-template-columns: v-bind('props.columns');
  grid-template-rows: v-bind('props.rows');
  grid-template-areas: v-bind('props.areas');
  grid-auto-flow: v-bind('props.auto_flow');
  grid-auto-columns: v-bind('props.auto_columns');
  grid-auto-rows: v-bind('props.auto_rows');

  align-items: v-bind('props.align_items');
  justify-items: v-bind('props.justify_items');
  align-content: v-bind('props.align_content');
  justify-content: v-bind('props.justify_content');

  gap: v-bind('gap');
  padding: v-bind('padding');
  border-radius: v-bind('radius');
}
</style>