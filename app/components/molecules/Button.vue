<!-- Компонент для кнопок -->

<script setup lang="ts">
import { TOKENS, type Color_Scheme, type Size } from "~/tokens";
import { get_color, get_disabled, get_rem, type Number_Rem, type Tag } from "~/utilities";
import { Flex, Text } from "../atoms";
import { type Css_Rule } from "~/composables/use_css";

// Свойства
const props = withDefaults(defineProps<{
  tag?: Tag; // Тег или компонент (по умолчанию button, можно NuxtLink)
  icon?: boolean;

  variant?: "background" | "outline" | "outline_alt"; // Вариант оформления
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
  variant: "background",
  size: "default",
  mono: false,
  color: "gray_9",
  color_hover: "gray_9",
  background: "gray_1",
  background_hover: "gray_3",
  disabled: false,
  icon: false,
});

const padding_by_size: Record<Size, Number_Rem> = {
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
const border_width_by_size: Record<Size, number> = {
  default: 1,
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 2
}

const padding = computed<Number_Rem>(() => {
  const p = padding_by_size[props.size];
  // Для вариантов с border компенсируем его в вертикальном padding,
  // чтобы все варианты были одной высоты (border рисуется на внешнем Flex
  // и добавляет высоту элементу, как в InputText)
  if (props.variant === "outline" || props.variant === "outline_alt") {
    if (Array.isArray(p)) {
      return [p[0] - border_width.value, p[1]];
    }
    return (p as number) - border_width.value;
  }
  return p;
});
const gap = computed(() => gap_by_size[props.size]);
const border_width = computed(() => border_width_by_size[props.size]);

// Свойства в стили
const css_rule = computed<Css_Rule>(() => {
  const color = get_color(props.color);
  const color_hover = get_color(props.color_hover);
  const background = get_color(props.background);
  const background_hover = get_color(props.background_hover);

  // Базовые стили в зависимости от варианта оформления
  const base = (() => {
    if (props.variant === "outline" || props.variant === "outline_alt") {
      return {
        color: color,
        backgroundColor: "transparent",
        border: `${get_rem(border_width.value)} solid ${color}`,
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
    if (props.variant === "outline") {
      return {
        color: color_hover,
        border: `${get_rem(border_width.value)} solid ${color_hover}`,
      };
    }
    if (props.variant === "outline_alt") {
      return {
        color: color_hover,
        backgroundColor: background,
        borderColor: background,
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
      transform: "scale(0.97)"
    },

    // Отключённое состояние
    ...(props.disabled ? get_disabled() : {}),

    ...props.css,
  };
});
</script>

<template>
  <Flex
    :tag="props.tag"
    :css="css_rule"
    :disabled="props.disabled || undefined"
    v-bind="$attrs"
  >
    <Text family="body" :size="props.size" :mono="props.mono">
      <Flex 
        inline
        align_items="center"
        justify_content="center"
        :gap="gap"
        :padding="icon ? (padding as number[])[0] : padding"
      >
        <slot />
      </Flex>
    </Text>
  </Flex>
</template>
