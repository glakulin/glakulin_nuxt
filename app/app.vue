<script setup lang="ts">
import "~/global.css";
import { Flex } from "./components/atoms";
import { Header, Footer } from "./components/molecules";
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
    <Header />
    <Flex
      tag="main" direction="column" :gap="64" :padding="[96, screen_padding, 12, screen_padding]"
    >
      <NuxtPage />
      <Footer />
    </Flex>
  </div>
</template>
