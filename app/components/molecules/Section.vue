<script setup lang="ts">
import { type Css_Rule } from "~/composables/use_css";
import { Flex, Icon, Text } from "../atoms";

// Свойства
const props = defineProps<{
  css?: Css_Rule; // Дополнительные стили
}>();
</script>

<template>
  <Flex
    tag="section"
    direction="column"
    :gap="48"
    :css="props.css"
  >
    <Text tag="h1" family="heading" size="xl">
      <Flex :gap="12">
        <slot name="heading"><Icon name="nf-md-format_section" />Section</slot>
      </Flex>
    </Text>
    <slot />
  </Flex>
</template>