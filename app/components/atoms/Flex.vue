<!-- Компонент для flexbox -->

<script setup lang="ts">
import type { CSSProperties as CSSP } from "vue";
import { type Number_Rem } from "~/utilities";
import { Style } from "./";
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = defineProps<{
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
  
  css?: Css_Rule; // Дополнительные стили
}>()

// Свойства в стили
const css_rule = computed<Css_Rule>(() => ({
  display: props.inline ? "inline-flex" : "flex",
  flexDirection: props.direction,
  flexWrap: props.wrap,

  alignItems: props.align_items,
  alignContent: props.align_content,
  justifyItems: props.justify_items,
  justifyContent: props.justify_content,

  gap: props.gap,
  padding: props.padding,
  borderRadius: props.radius,
  ...props.css
}));
</script>

<template>
  <Style :css="css_rule" v-bind="$attrs">
    <slot />
  </Style>
</template>