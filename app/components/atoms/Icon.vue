<!-- Компонент для иконок из nerd font -->

<script setup lang="ts">
import { type Css_Rule } from "~/composables/use_css";
import { Style } from ".";

// Свойства
const props = defineProps<{
  name?: string; // Имя иконки
  css?: Css_Rule; // Дополнительные стили
}>();
</script>

<template>
  <Style tag="i" :css="props.css" :class="`nf ${props.name}`"></Style>
</template>