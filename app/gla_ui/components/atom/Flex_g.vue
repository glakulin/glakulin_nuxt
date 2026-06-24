<!-- Компонент для flexbox -->

<script setup lang="ts">
// Библиотека для типов из css
import type { Property } from "csstype";

// Свойства
const props = withDefaults(defineProps<{
  tag?: string;
  inline?: boolean;
  direction?: Property.FlexDirection;
  wrap?: Property.FlexWrap;
  flex?: Property.Flex;
  gap?: Property.Gap;
  padding?: Property.Padding;
}>(), {
  tag: "div",
  inline: false,
  direction: "row",
  wrap: "nowrap",
  gap: 0,
  padding: 0
});
</script>

<template>
  <component
    :is="tag"
    class="flex"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.flex {
  display: v-bind('props.inline ? "inline-flex" : "flex"');
  flex-direction: v-bind('props.direction');
  flex-wrap: v-bind('props.wrap');
  flex: v-bind('props.flex');
  gap: v-bind('props.gap');
  padding: v-bind('props.padding');
}
</style>
