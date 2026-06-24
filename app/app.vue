<script setup lang="ts">
import { tokens } from "@/gla_ui/tokens";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
  </div>
</template>

<style lang="scss">
body {
  background-color: v-bind('tokens.colors.gray[9]');
}
</style>
