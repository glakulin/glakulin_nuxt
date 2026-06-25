<script setup lang="ts">
import { Section, Icon, Flex, Text } from '~/gla_ui/components';
</script>

<template>
  <Section>
    <template #heading><Icon name="waving_hand" />Привет</template>
    <Flex direction="column">
      <Text size="xl">Я — Глакулин</Text>
      <Text color="gray-3">Даниил Вякулин</Text>
    </Flex>
  </Section>
</template>
