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

  // Свойства для выравнивания
  align_items?: Property.AlignItems;
  justify_items?: Property.JustifyItems;
  align_content?: Property.AlignContent;
  justify_content?: Property.JustifyContent;

  gap?: Num_Values; // Промежуток
  padding?: Num_Values; // Отступы
  radius?: Num_Values; // Скругление
}>(), {
  // Значения по умолчанию
  tag: "div",
  inline: false,
  direction: "row",
  wrap: "nowrap",
  align_items: "flex-start",
  justify_items: "flex-start",
  align_content: "flex-start",
  justify_content: "flex-start",
  gap: () => [0] as Num_Values,
  padding: () => [0] as Num_Values,
  radius: () => [0] as Num_Values
});

// Обработка свойств
const gap = computed(() => get_nums(props.gap));
const padding = computed(() => get_nums(props.padding));
const radius = computed(() => get_nums(props.radius));
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

  align-items: v-bind('props.align_items');
  justify-items: v-bind('props.justify_items');
  align-content: v-bind('props.align_content');
  justify-content: v-bind('props.justify_content');

  gap: v-bind('gap');
  padding: v-bind('padding');
  border-radius: v-bind('radius');
}
</style>
