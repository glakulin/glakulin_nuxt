<!-- Компонент для иконок из nerd font -->

<script setup lang="ts">
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = defineProps<{
  name: string; // Имя иконки
  css?: Css_Rule; // Дополнительные стили
}>();
</script>

<template>
  <i :class="`nf ${props.name}`"></i>
</template>