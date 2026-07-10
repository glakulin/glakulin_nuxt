<!-- Выпадающее меню хэдера -->

<script setup lang="ts">
import { type Css_Rule } from "~/composables/use_css";
import { Flex, Icon, Text } from "../atoms";
import { TOKENS } from "~/tokens";
import { LinkText } from ".";
import { get_color, get_rem } from "~/utilities";
import { PAGES, SOCIALS } from "~/static";

// Свойства
const props = defineProps<{
  is_open: boolean;
}>();

// Адаптив
const { size } = use_window_size();

const screen_padding = computed(() => {
  return TOKENS.size.screen_padding[size.value];
});

// Стили обёртки (позиционирование под хэдером)
const css_rule_wrapper = computed<Css_Rule>(() => ({
  position: "fixed",
  width: "100%",
  marginTop: 46,
  zIndex: 998,
  pointerEvents: props.is_open ? "auto" : "none"
}));

// Стили самого меню (анимация выезжания сверху)
const css_rule = computed<Css_Rule>(() => ({
  width: "100%",
  backgroundColor: `${get_color("gray_9")}d0`,
  border: `${get_rem(1)} solid ${get_color("gray_8")}`,
  backdropFilter: "blur(4px)",
  opacity: props.is_open ? 1 : 0,
  marginTop: props.is_open ? 0 : -46,
  transition: TOKENS.transition
}));
</script>

<template>
  <Flex tag="nav" :css="css_rule_wrapper" justify_content="center" :padding="[0, screen_padding]">
    <Flex :css="css_rule" :padding="12" justify_content="space-between">
      <!-- Соцсети (слева) -->
      <Flex :gap="8" direction="column">
        <LinkText v-for="social in SOCIALS" :key="social.label" :href="social.href" color="gray_1" color_hover="gray_3">
          <Text family="body" size="xs">
            <Flex :gap="4"><Icon :name="social.icon" />{{ social.label }}</Flex>
          </Text>
        </LinkText>
      </Flex>

      <!-- Страницы (справа) -->
      <Flex :gap="8" direction="column">
        <LinkText v-for="page in PAGES" :key="page.href" :href="page.href" color="gray_1" color_hover="gray_3">
          <Text family="body" size="xs">
            <Flex :gap="4">{{ page.label }}<Icon :name="page.icon" /></Flex>
          </Text>
        </LinkText>
      </Flex>
    </Flex>
  </Flex>
</template>