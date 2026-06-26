<script setup lang="ts">
withDefaults(defineProps<{
  name: string; // Имя иконки
}>(), {
  name: "fa-heart"
});
</script>

<template>
  <i class="nf" :class="'nf-' + name"></i>
</template>