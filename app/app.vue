<script setup lang="ts">
import Flex from '~/gla_ui/components/atom/Flex.vue';

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <Flex
      tag="main"
      direction="column"
      :gap="[64]"
    >
      <NuxtPage />
    </Flex>
  </div>
</template>
