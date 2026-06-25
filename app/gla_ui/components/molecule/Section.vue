<script setup lang="ts">
import { Flex, Text } from '../';
</script>

<template>
 <Flex
  tag="section"
  direction="column"
  :gap="[48]"
 >
  <Text
    tag="h1"
    family="heading"
    size="xl"
    :gap="[16]"
  >
    <slot name="heading">Heading</slot>
  </Text>
  <slot />
 </Flex>  
</template>