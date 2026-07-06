<!-- Компонент для текстовых блоков -->

<script setup lang="ts">
import { TOKENS, type Color_Scheme, type Size } from "~/tokens";
import { get_color } from "~/utilities";
import { Style } from "./";
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = defineProps<{
  family?: "heading" | "body"; // Шрифт
  size?: Size; // Размер
  mono?: boolean; // Моноширинный или нет
  color?: Color_Scheme; // Цвет
  
  css?: Css_Rule; // Дополнительные стили
}>()

// Свойства в стили
const css_rule = computed<Css_Rule>(() => {
  // Константа для проверки family и size
  const has_text_style = props.family && props.size;

  return {
    fontFamily: props.mono ? TOKENS.typography.mono : (props.family ? TOKENS.typography[props.family].family : "inherit"),
    fontSize: has_text_style ? TOKENS.typography[props.family].size[props.size] : "inherit",
    fontWeight: has_text_style ? TOKENS.typography[props.family].weight[props.size] : "inherit",
    lineHeight: "100%",
    color: props.color ? get_color(props.color) : "inherit",
    ...props.css
  };
});
</script>

<template>
  <Style :css="css_rule" v-bind="$attrs">
    <slot />
  </Style>
</template>