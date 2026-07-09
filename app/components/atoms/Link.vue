<!-- Компонент для ссылок -->

<script setup lang="ts">
import { TOKENS, type Color_Scheme } from "~/tokens";
import { get_color } from "~/utilities";
import { Style } from "./";
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = defineProps<{
  color?: Color_Scheme; // Цвет 
  color_hover?: Color_Scheme; // Цвет при наведении
  to?: string; // Путь ссылки
  css?: Css_Rule; // Дополнительные стили
}>();

// Свойства в стили
const css_rule = computed<Css_Rule>(() => {
  const baseColor = props.color ? get_color(props.color) : "inherit";
  const hoverColor = props.color_hover ? get_color(props.color_hover) : "inherit";

  return {
    color: baseColor,
    textDecoration: "none",
    transition: `color ${TOKENS.transition}`,
    hover: {
      color: hoverColor
    },
    ...props.css
  };
});
</script>

<template>
  <NuxtLink :to="to">
    <Style :css="css_rule" v-bind="$attrs">
      <slot />
    </Style>
  </NuxtLink>
</template>