<!-- Компонент для gridbox -->

<script setup lang="ts">
import type { CSSProperties as CSSP } from "vue";
import { type Number_Rem, type Tag } from "~/utilities";
import { Style } from "./";
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = defineProps<{
  tag?: Tag; // Тег или компонент

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
  
  css?: Css_Rule; // Дополнительные стили
}>()

// Свойства в стили
const css_rule = computed<Css_Rule>(() => ({
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
  borderRadius: props.radius,
  ...props.css
}));
</script>

<template>
  <Style :tag="props.tag" :css="css_rule" v-bind="$attrs">
    <slot />
  </Style>
</template>
