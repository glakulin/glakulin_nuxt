<script setup lang="ts">
import { Section, Icon, Flex, Text, Link } from '~/gla_ui/components';
</script>

<template>
  <Section>
    <template #heading><Icon name="md-hand_wave" />Привет</template>
    <Flex :gap="[12]" direction="column">
      <Flex :gap="[12]">
        <Flex direction="column">
          <Text size="xl">Я — Глакулин</Text>
          <Text color="gray-3">Даниил Вякулин</Text>
        </Flex>
        <svg width="48" height="48"><use width="48" height="48" href="/images/logo.svg" /></svg>
      </Flex>
      <Text size="sm">Прохожу игры на стримах 
        <Link href="https://www.twitch.tv/glakulin" target="_blank" color_hover="accent-5"><Icon name="md-twitch"/> Twitch</Link>
        и выклыдываю видео на 
        <Link href="https://www.youtube.com/@glakulin" target="_blank" color_hover="error-5"><Icon name="md-youtube"/> YouTube</Link>.
        Делаю дизайн и разрабатываю всякое разное (например — этот сайт).</Text>
    </Flex>
  </Section>
</template>
