<script setup lang="ts">
import { Flex } from '~/gla_ui/components';
import { tokens } from '~/gla_ui/tokens';

// Адаптив
const { width } = use_window_size();
const screens = tokens.size.screen;
const paddings = tokens.size.padding;

const padding = computed(() => {
  const w = width.value;
  if (w >= screens.xl) return paddings.xl;
  if (w >= screens.lg) return paddings.lg;
  if (w >= screens.md) return paddings.md;
  if (w >= screens.sm) return paddings.sm;
  if (w >= screens.xs) return paddings.xs;
  return paddings.default;
});
</script>

<template>
<NuxtRouteAnnouncer />
<Flex
  tag="main"
  direction="column"
  :gap="[64]"
  :padding="[0, padding]"
>
  <NuxtPage />
</Flex>
</template>
