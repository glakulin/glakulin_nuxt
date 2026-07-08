<!-- Компонент секции -->

<script setup lang="ts">
import { type Css_Rule } from "~/composables/use_css";
import { Flex, Icon, Text } from "../atoms";

// Свойства
const props = defineProps<{
  css?: Css_Rule; // Дополнительные стили
  anchor?: string; // Якорь
}>();
</script>

<template>
  <Flex
    tag="section"
    direction="column"
    :gap="48"
    :css="props.css"
  >
    <a :id="props.anchor" :style="{width: 0, height: 0, position: 'absolute'}"></a>
    <Text tag="h1" family="heading" size="xl">
      <Flex wrap="wrap" :gap="12">
        <slot name="heading"><Icon name="nf-md-format_section" />Section</slot>
      </Flex>
    </Text>
    <slot />
  </Flex>
</template>