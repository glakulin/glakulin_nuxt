<!-- Страница ссылок -->

<script setup lang="ts">
import { NuxtLink } from "#components";
import { Flex, Icon, Text } from "~/components/atoms";
import { Section } from "~/components/molecules";
import { SOCIALS } from "~/static";
import { TOKENS } from "~/tokens";
import { get_color, get_rem } from "~/utilities";

const get_social_label = (href: string): string => {
  return href.replace(/^(?:mailto:|https?:\/\/(?:www\.)?|www\.)/, "");
};
</script>

<template>
  <Section anchor="links">
    <template #heading>
      <Icon name="nf-fa-link" />Links
    </template>

    <!-- Описание -->
    <Text tag="p" family="body" size="sm" color="gray_3">
      I’m Glakulin, a UX/UI designer and developer. Here are my main public links: socials, content platforms and code
      profiles.
    </Text>

    <!-- Карточки ссылок -->
    <Flex wrap="wrap" :gap="24">
      <Flex :tag="NuxtLink" :padding="18" v-for="social in SOCIALS" :key="social.href" :to="social.href" target="_blank" rel="noopener noreferrer" :css="{
        '--card-color': get_color('gray_8'),
        '--card-glow': get_color('accent_9'),
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'stretch',
        color: get_color('gray_2'),
        border: `${get_rem(2)} solid var(--card-color)`,
        cursor: 'pointer',
        background: `linear-gradient(160deg, ${get_color('gray_9')} 0%, var(--card-glow) 100%)`,
        transition: `color ${TOKENS.transition}, border-color ${TOKENS.transition}, background ${TOKENS.transition}`,
        hover: {
          color: get_color('accent_2'),
          '--card-color': get_color('accent_2'),
          '--card-glow': get_color('accent_8')
        }
      }">
        <Flex direction="column" justify_content="space-between" :gap="28" :css="{ width: '100%' }">
          <Icon :name="social.icon" :css="{
            fontSize: 40,
            color: 'var(--card-color)',
            transition: `color ${TOKENS.transition}`
          }" />

          <Flex direction="column" :gap="8">
            <Text family="heading" size="default">{{ social.label }}</Text>
            <Text family="body" size="xs" color="gray_5" mono>{{ get_social_label(social.href) }}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Section>
</template>
