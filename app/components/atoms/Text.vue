<!-- Компонент для текстовых блоков -->

<script setup lang="ts">
import { TOKENS, type Size } from "~/tokens";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // Тег

  family?: "heading" | "body"; // Шрифт
  size?: Size; // Размер
  mono?: boolean; // Моноширинный или нет
}>(), {
  // Значения по умолчанию
  tag: "p",
  mono: false
});

// Свойства в стили
const css = use_css();
const class_name = computed(() => {
  // константа для проверки family и size
  const has_text_style = props.family && props.size;

  return css({
  fontFamily: props.mono ? TOKENS.typography.mono : (props.family ? TOKENS.typography[props.family].family : "inherit"),
  fontSize: has_text_style ? TOKENS.typography[props.family].size[props.size] : "inherit",
  fontWeight: has_text_style ? TOKENS.typography[props.family].weight[props.size] : "inherit",
  lineHeight: "100%"
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