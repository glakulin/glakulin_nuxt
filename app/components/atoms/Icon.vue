<!-- Компонент для иконок из nerd font -->

<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <i :class="`nf ${props.name}`"></i>
</template>