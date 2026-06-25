<!-- Комопнент для текстовых блоков -->

<script setup lang="ts">
import { tokens, type Size } from "~/gla_ui/tokens";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // HTML тег
  family?: "body" | "heading"; // Шрифт
  size?: Size; // Размер
}>(), {
  // Значения по умолчанию
  tag: "p",
  family: "body",
  size: "default"
});

// Свойства в стили
const text_styles = computed(() => {
  return {
    fontSize: `${tokens.typography[props.family].size[props.size] * tokens.rem}rem`,
    fontWeight: tokens.typography[props.family].weight[props.size],
    lineHeight: `${tokens.typography[props.family].size[props.size] * tokens.rem}rem`
  };
});
</script>

<template>
  <component
    :is="props.tag"
    :class="props.family"
    :style="text_styles"
  >
    <slot />
  </component>
</template>
