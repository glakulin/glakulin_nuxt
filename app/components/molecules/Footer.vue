<!-- Футер -->

<script setup lang="ts">
import { type Css_Rule } from "~/composables/use_css";
import { Flex, Icon, Text } from "../atoms";
import { get_color, get_rem } from "~/utilities";
import { Link } from ".";
import { PAGES, SOCIALS } from "~/static";

// Стили футера
const css_rule = computed<Css_Rule>(() => ({
  width: "100%",
  backgroundColor: `${get_color("gray_9")}d0`,
  border: `${get_rem(1)} solid ${get_color("gray_8")}`,
}));
</script>

<template>
    <Flex :css="css_rule" wrap="wrap" :padding="12" justify_content="space-between" align_items="center">
      <Flex :gap="8" direction="column">
        <Link v-for="social in SOCIALS" :key="social.label" :href="social.href" color="gray_1" color_hover="gray_3">
          <Text family="body" size="xs">
            <Flex :gap="4"><Icon :name="social.icon" />{{ social.label }}</Flex>
          </Text>
        </Link>
      </Flex>

      <Text family="heading" size="xl"><svg :style="{aspectRatio: '97 / 24', height: '1em'}"><use href="/logo_full.svg"></use></svg></Text>

      <!-- Страницы (справа) -->
      <Flex :gap="8" direction="column">
        <Link v-for="page in PAGES" :key="page.href" :href="page.href" color="gray_1" color_hover="gray_3">
          <Text family="body" size="xs">
            <Flex :gap="4">{{ page.label }}<Icon :name="page.icon" /></Flex>
          </Text>
        </Link>
      </Flex>
    </Flex>
</template>