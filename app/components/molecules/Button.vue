<!-- Компонент для кнопок -->

<script setup lang="ts">
import { TOKENS, type Color_Scheme, type Size } from "~/tokens";
import { get_color, get_disabled, get_rem, type Tag } from "~/utilities";
import { Flex, Text } from "../atoms";
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = withDefaults(defineProps<{
  tag?: Tag; // Тег или компонент (по умолчанию button, можно NuxtLink)

  style?: "background" | "outline" | "outline_alt"; // Вариант оформления
  size?: Size; // Размер: default..xl
  mono?: boolean; // Моноширинный шрифт

  color?: Color_Scheme; // Цвет текста
  color_hover?: Color_Scheme; // Цвет текста при наведении

  background?: Color_Scheme; // Цвет фона
  background_hover?: Color_Scheme; // Цвет фона при наведении

  disabled?: boolean; // Отключённая кнопка

  css?: Css_Rule; // Дополнительные стили
}>(), {
  tag: "button",
  style: "background",
  size: "default",
  mono: false,
  color: "gray_9",
  color_hover: "gray_9",
  background: "gray_1",
  background_hover: "gray_3",
  disabled: false,
});

// Свойства в стили
const css_rule = computed<Css_Rule>(() => {
  const color = get_color(props.color);
  const color_hover = get_color(props.color_hover);
  const background = get_color(props.background);
  const background_hover = get_color(props.background_hover);

  // Базовые стили в зависимости от варианта оформления
  const base = (() => {
    if (props.style === "outline" || props.style === "outline_alt") {
      return {
        color: color,
        backgroundColor: "transparent",
        border: `${get_rem(1)} solid ${color}`,
      };
    }
    return {
      color: color,
      backgroundColor: background,
      border: "none",
    };
  })();

  // Hover стили в зависимости от варианта оформления
  const hover = (() => {
    if (props.style === "outline") {
      return {
        color: color_hover,
        border: `${get_rem(1)} solid ${color_hover}`,
      };
    }
    if (props.style === "outline_alt") {
      return {
        color: color_hover,
        backgroundColor: background,
      };
    }
    return {
      color: color_hover,
      backgroundColor: background_hover,
    };
  })();

  return {
    // Базовые
    ...base,
    cursor: props.disabled ? "default" : "pointer",
    transition: `color ${TOKENS.transition}, background-color ${TOKENS.transition}, border-color ${TOKENS.transition}, transform ${TOKENS.transition}`,

    // Состояния
    hover,

    active: {
      transform: "scale(0.95)"
    },

    // Отключённое состояние
    ...(props.disabled ? get_disabled() : {}),

    ...props.css,
  };
});

// Padding и gap в зависимости от размера
const padding_by_size: Record<Size, readonly number[]> = {
  default: [2, 4],
  xs: [3, 6],
  sm: [4, 8],
  md: [6, 12],
  lg: [7, 14],
  xl: [8, 16],
};
const gap_by_size: Record<Size, number> = {
  default: 2,
  xs: 3,
  sm: 4,
  md: 6,
  lg: 7,
  xl: 8,
};

const padding = computed(() => padding_by_size[props.size]);
const gap = computed(() => gap_by_size[props.size]);
</script>

<template>
  <Flex
    :tag="props.tag"
    inline
    align_items="center"
    justify_content="center"
    :gap="gap"
    :padding="padding"
    :css="css_rule"
    :disabled="props.disabled || undefined"
    v-bind="$attrs"
  >
    <Text family="body" :size="props.size" :mono="props.mono">
      <slot />
    </Text>
  </Flex>
</template>
