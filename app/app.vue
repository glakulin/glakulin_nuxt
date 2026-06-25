<script setup lang="ts">
import { Flex } from '~/gla_ui/components';

</script>

<template>
<NuxtRouteAnnouncer />
<Flex
  tag="main"
  direction="column"
  :gap="[64]"
>
  <NuxtPage />
</Flex>
</template>
