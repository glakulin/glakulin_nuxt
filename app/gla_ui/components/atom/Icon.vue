<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string; // Имя иконки
}>(), {
  name: "home"
});
</script>

<template>
  <span class="material-symbols-rounded">
    {{ props.name }}
  </span>
</template>
