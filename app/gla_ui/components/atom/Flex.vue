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

// Свойства в стили
const flex_styles = computed(() => {
  return {
    display: props.inline ? "inline-flex" : "flex",
    flexDirection: props.direction,
    flexWrap: props.wrap,
    alignItems: props.align_items,
    justifyItems: props.justify_items,
    alignContent: props.align_content,
    justifyContent: props.justify_content,
    gap: get_nums(props.gap),
    padding: get_nums(props.padding),
    borderRadius: get_nums(props.radius)
  };
});
</script>

<template>
  <component
    :is="props.tag"
    :style="flex_styles"
  >
    <slot />
  </component>
</template>
