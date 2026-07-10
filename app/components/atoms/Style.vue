<!-- Главный компонент для стилей -->

<script setup lang="ts">
import { computed } from "vue";
import { type Tag } from "~/utilities";

// Свойства
const props = withDefaults(defineProps<{
  css?: Css_Rule; // Объект со стилями
  tag?: Tag; // Тег или компонент
}>(),{
  // Значения по умолчанию
  tag: "div",
});

// Инициализируем хук
const css = use_css();

// Вычисляем классы на основе свойства
const computedClasses = computed(() => {
  if (!props.css) return "";
  return css(props.css);
});
</script>

<template>
  <component :is="tag" :class="computedClasses">
    <slot />
  </component>
</template>