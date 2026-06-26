<script setup lang="ts">
import { Flex, Text } from '../';
</script>

<template>
 <Flex
  tag="section"
  direction="column"
  :gap="[40]"
 >
  <Text
    tag="h1"
    family="heading"
    size="xl"
  >
    <Flex :gap="[16]">
      <slot name="heading">Heading</slot>
    </Flex>
  </Text>
  <slot />
 </Flex>  
</template>