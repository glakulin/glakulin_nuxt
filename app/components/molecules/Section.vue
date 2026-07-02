<script setup lang="ts">
import { Flex } from '../atoms';
</script>

<template>
  <Flex
    tag="section"
    direction="column" :gap="48"
  >
    <Flex :gap="12">
      <slot name="heading"></slot>
    </Flex>
    <slot />
  </Flex>
</template>