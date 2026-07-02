<!-- Главная страница -->

<script setup lang="ts">
import { Flex, Icon, Text } from "~/components/atoms";
import { Section } from "~/components/molecules";

</script>

<template>
  <Section>
    <template #heading><Icon name="nf-md-hand_wave" />Hello</template>
    <Flex
      direction="column" 
    >
      <Text family="heading" size="sm">I'm Glakulin</Text>
    </Flex>
  </Section>
</template>