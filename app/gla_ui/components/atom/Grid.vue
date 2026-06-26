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

// Свойства в стили
const grid_styles = use_css({
  display: props.inline ? "inline-grid" : "grid",
  gridTemplateColumns: props.columns,
  gridTemplateRows: props.rows,
  gridTemplateAreas: props.areas,
  gridAutoFlow: props.auto_flow,
  gridAutoColumns: props.auto_columns,
  gridAutoRows: props.auto_rows,

  alignItems: props.align_items,
  justifyItems: props.justify_items,
  alignContent: props.align_content,
  justifyContent: props.justify_content,

  gap: get_nums(props.gap),
  padding: get_nums(props.padding),
  borderRadius: get_nums(props.radius)
});
</script>

<template>
  <component
    :is="props.tag"
    :class="grid_styles"
  >
    <slot />
  </component>
</template>