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

// Обработка свойств
const size = computed(() => `${tokens.typography[props.family].size[props.size] * tokens.rem}rem`);
const weight = computed(() => tokens.typography[props.family].weight[props.size]);
</script>

<template>
  <component
    :is="props.tag"
    :class="`${props.family} text`"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.text {
  font-size: v-bind('size');
  font-weight: v-bind('weight');
  line-height: v-bind('size');
}
</style>
