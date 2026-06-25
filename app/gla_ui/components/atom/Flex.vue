<!-- Компонент для flexbox -->

<script setup lang="ts">
import type { Property } from "csstype"; // Библиотека для типов из css
import { get_nums, type Num_Values } from "~/gla_ui/tokens";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // HTML тег
  inline?: boolean; // inline-flex или просто flex
  direction?: Property.FlexDirection; // Направление
  wrap?: Property.FlexWrap; // Перенос
  flex?: Property.Flex; // Рост, уменьшение, база
  gap?: Num_Values; // Промежуток
  padding?: Num_Values; // Отсупы
  // Свойства для выравнивания
  alignItems?: Property.AlignItems;
  justifyItems?: Property.JustifyItems;
  alignContent?: Property.AlignContent;
  justifyContent?: Property.JustifyContent;
}>(), {
  // Значения по умолчанию
  tag: "div",
  inline: false,
  direction: "row",
  wrap: "nowrap",
  gap: () => [0] as Num_Values,
  padding: () => [0] as Num_Values
});

// Обработка свойств
const gap = computed(() => get_nums(props.gap));
const padding = computed(() => get_nums(props.padding));
</script>

<template>
  <component
    :is="props.tag"
    class="flex"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
// Стили по свойствам
.flex {
  display: v-bind('props.inline ? "inline-flex" : "flex"');
  flex-direction: v-bind('props.direction');
  flex-wrap: v-bind('props.wrap');
  flex: v-bind('props.flex');
  gap: v-bind('gap');
  padding: v-bind('padding');
  align-items: v-bind('props.alignItems');
  justify-items: v-bind('props.justifyItems');
  align-content: v-bind('props.alignContent');
  justify-content: v-bind('props.justifyContent');
}
</style>
