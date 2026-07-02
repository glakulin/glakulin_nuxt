<script setup lang="ts">
import "~/global.css";
import { Flex } from "./components/atoms";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <Flex
      tag="main" direction="column" :gap="64"
    >
      <NuxtPage />
    </Flex>
  </div>
</template>
