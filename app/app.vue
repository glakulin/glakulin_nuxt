<script setup lang="ts">
import "~/global.css";
import { Flex } from "./components/atoms";
import { TOKENS } from "./tokens";

// Адаптивные отступы
const { size } = use_window_size();

const screen_padding = computed(() => {
  return TOKENS.size.screen_padding[size.value];
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <Flex
      tag="main" direction="column" :gap="64" :padding="[0, screen_padding]"
    >
      <NuxtPage />
    </Flex>
  </div>
</template>
