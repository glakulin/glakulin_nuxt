<!-- Хэдер -->

<script setup lang="ts">
import { type Css_Rule } from "~/composables/use_css";
import { Flex, Icon, Link, Text } from "../atoms";
import { TOKENS } from "~/tokens";
import { get_color, get_rem } from "~/utilities";
import { HeaderMenu } from ".";

// Адаптив
const { size } = use_window_size();

const screen_padding = computed(() => {
  return TOKENS.size.screen_padding[size.value];
});

// Стили контейнера
const css_rule_container = computed<Css_Rule>(() => ({
  position: "fixed",
  width: "100%",
  marginTop: get_rem(12),
  zIndex: 999
}));

// Стили хэдера
const css_rule = computed<Css_Rule>(() => ({
  width: "100%",
  backgroundColor: `${get_color("gray_9")}d0`,
  border: `${get_rem(1)} solid ${get_color("gray_8")}`,
  backdropFilter: "blur(4px)"
}));

// Текущая страница
const route = useRoute();

// Состояние меню
const is_menu_open = ref<boolean>(false);
</script>

<template>
  <Flex tag="header" :css="css_rule_container" justify_content="center" :padding="[0, screen_padding]">
    <Flex :css="css_rule" :padding="12" justify_content="space-between" align_items="center">
      <Text family="body" size="sm"><svg :style="{aspectRatio: '97 / 24', height: '1em'}"><use href="/logo_full.svg"></use></svg></Text>
      <Text family="body" size="sm" color="gray_8">{{ route.name }}</Text>
      <Flex tag="button" @click="is_menu_open = !is_menu_open">
        <Text family="body" size="sm"><Link color="gray_1" color_hover="gray_3"><Icon :name="is_menu_open ? 'nf-md-close' : 'nf-md-menu'" /></Link></Text>
      </Flex>
    </Flex>
  </Flex>
  <HeaderMenu :is_open="is_menu_open" />
</template>