<!-- Компонент для текстовых блоков -->

<script setup lang="ts">
import { TOKENS, type Color_Scheme, type Size } from "~/tokens";
import { get_color } from "~/utilities";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // Тег

  family?: "heading" | "body"; // Шрифт
  size?: Size; // Размер
  mono?: boolean; // Моноширинный или нет

  color?: Color_Scheme; // Цвет
}>(), {
  // Значения по умолчанию
  tag: "p",
  mono: false
});

// Свойства в стили
const css = use_css();
const class_name = computed(() => {
  // Константа для проверки family и size
  const has_text_style = props.family && props.size;

  return css({
    fontFamily: props.mono ? TOKENS.typography.mono : (props.family ? TOKENS.typography[props.family].family : "inherit"),
    fontSize: has_text_style ? TOKENS.typography[props.family].size[props.size] : "inherit",
    fontWeight: has_text_style ? TOKENS.typography[props.family].weight[props.size] : "inherit",
    lineHeight: "100%",
    color: props.color ? get_color(props.color) : "inherit"
})});
</script>

<template>
  <component
    :is="props.tag"
    :class="class_name"
  >
    <slot />
  </component>
</template>