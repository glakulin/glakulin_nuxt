<script setup lang="ts">
import { Flex, Icon, Text } from "../atoms";
</script>

<template>
  <Flex
    tag="section"
    direction="column" :gap="48"
  >
    <Text family="heading" size="xl">
      <Flex :gap="12">
        <slot name="heading"><Icon name="nf-md-format_section" />Section</slot>
      </Flex>
    </Text>
    <slot />
  </Flex>
</template>