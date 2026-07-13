<!-- Компонент для текстовых инпутов -->

<script setup lang="ts">
import { computed, ref } from "vue";
import { TOKENS, type Color_Scheme, type Size } from '~/tokens';
import { Flex, Icon, Style, Text } from '../atoms';
import { get_color, get_disabled, get_rem, type Number_Rem } from '~/utilities';

const props = withDefaults(defineProps<{
  variant?: "background" | "outline" | "outline_alt" | "line"; // Вариант оформления
  size?: Size; // Размер

  name?: string; // Имя
  type?: "text" | "password"; // Тип
  required?: boolean; // Обязательность
  pattern?: string; // Шаблон
  placeholder?: string; // Плейсхолдер

  color?: Color_Scheme; // Цвет текста
  color_hover?: Color_Scheme; // Цвет текста при наведении

  background?: Color_Scheme; // Цвет фона
  background_hover?: Color_Scheme; // Цвет фона при наведении

  disabled?: boolean; // Отключённый input

  css?: Css_Rule; // Дополнительные стили

  modelValue?: string | number; // v-model
}>(), {
  variant: "background",
  size: "default",
  type: "text",
  color: "gray_9",
  color_hover: "gray_9",
  background: "gray_1",
  background_hover: "gray_3",
  disabled: false,
  required: false
});

// Padding в зависимости от размера
const padding_by_size: Record<Size, Number_Rem> = {
  default: 2,
  xs: 3,
  sm: 4,
  md: 6,
  lg: 7,
  xl: 8,
};

const padding = computed(() => padding_by_size[props.size]);

// Толщина границы в зависимости от размера
const border_width_by_size: Record<Size, number> = {
  default: 1,
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 2,
};

const border_width = computed(() => border_width_by_size[props.size]);

// Высота инпута = высота строки шрифта минус толщина border (компенсируем,
// т.к. border рисуется на Flex-обёртке и добавляет высоту элементу).
// Вертикальные отступы даёт Flex-обёртка (padding), поэтому весь элемент =
// font_size - border_total + padding*2 = 40 для всех вариантов (для md: 28 + 12 = 40).
const border_total = computed(() => {
  if (props.variant === "outline" || props.variant === "outline_alt") return border_width.value * 2;
  if (props.variant === "line") return border_width.value;
  return 0;
});

const input_height = computed(() => {
  return TOKENS.typography.body.size[props.size] - border_total.value;
});

// Состояние фокуса и наличия значения для плавающего лейбла
const is_focused = ref(false);
const has_value = ref(false);

// v-model
const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const on_input = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  has_value.value = value.length > 0;
  emit('update:modelValue', value);
};

// Плавающий label не нужен, если задан placeholder (используем нативный placeholder)
const has_label = computed(() => !props.placeholder);


// Состояние видимости пароля (для кнопки-глаза)
const show_password = ref(false);
const is_password = computed(() => props.type === "password");
const input_type = computed(() => (is_password.value && !show_password.value ? "password" : "text"));

// Лейбл «всплывает» (уменьшается до default и уезжает вверх)
// при фокусе инпута или когда поле уже заполнено
const is_floated = computed(() => is_focused.value || has_value.value);

// Размер шрифта лейбла: при всплывшем состоянии уменьшается до xs (для size >= md)
// или до default (для size < md); в невсплывшем состоянии — текущий size
const label_font_size = computed(() => {
  if (!is_floated.value) return TOKENS.typography.body.size[props.size];

  const floated_size: Size = props.size === "md" || props.size === "lg" || props.size === "xl"
    ? "xs"
    : "default";

  return TOKENS.typography.body.size[floated_size];
});

// Стили названия (плейсхолдер-лейбл поверх инпута)
const css_label = computed<Css_Rule>(() => {
  const is_line = props.variant === "line";
  const has_border = props.variant === "outline" || props.variant === "outline_alt";

  // Всплывший label выравниваем по левому краю элемента (left = 0).
  // Для вариантов с border (outline/outline_alt) сдвигаем чуть левее за счёт border.
  const left = is_floated.value
    ? (has_border ? -4 : 0)
    : (is_line ? 0 : padding.value!);

  return {
    position: "absolute",
    left: left,
    pointerEvents: "none",
    fontSize: get_rem(label_font_size.value),
    lineHeight: "100%",
    fontWeight: TOKENS.typography.body.weight.default,
    color: is_floated.value
      ? (is_focused.value ? get_color("accent_5") : get_color(props.background))
      : get_color(props.color),
    transformOrigin: "left center",
    transition: `top ${TOKENS.transition}, left ${TOKENS.transition}, transform ${TOKENS.transition}, color ${TOKENS.transition}, font-size ${TOKENS.transition}`,
    // Всплывшее состояние: сдвигаем выше за пределы поля.
    // Для line без дополнительного сдвига (+6), т.к. нет border/padding сверху.
    ...(is_floated.value
      ? {
          top: get_rem(-(label_font_size.value + (is_line ? 0 : 6))),
        }
      : {
          top: "50%",
          transform: "translateY(-50%)",
        }),
  };
});

// Стили инпута
const css_input = computed<Css_Rule>(() => {
  return {
    display: "block",
    width: "100%",
    height: get_rem(input_height.value),
    background: "transparent",
    // Чтобы введённый пароль не заезжал под кнопку-глаз
    ...(is_password.value && { paddingRight: 8 + TOKENS.typography.body.size[props.size] }),
  };
});

// Стили кнопки переключения видимости пароля
const css_toggle = computed<Css_Rule>(() => {
  return {
    position: "absolute",
    right: padding.value!,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    padding: "0",
    border: "none",
    background: "transparent",
    color: get_color(props.color),
    cursor: "pointer",
    fontSize: TOKENS.typography.body.size[props.size],
    hover: { color: get_color(props.color_hover) },
    transition: `color ${TOKENS.transition}`
  };
});

// Базовые стили в зависимости от варианта оформления
const base = computed<Css_Rule>(() => {
  const color = get_color(props.color);
  const background = get_color(props.background);

  if (props.variant === "outline" || props.variant === "outline_alt") {
    return {
      color: color,
      backgroundColor: "transparent",
      border: `${get_rem(border_width.value)} solid ${color}`,
    };
  }

  if (props.variant === "line") {
    return {
      color: color,
      backgroundColor: "transparent",
      borderBottom: `${get_rem(border_width.value)} solid ${color}`,
      paddingLeft: '0 !important',
      paddingRight: '0 !important'
    };
  }

  return {
    color: color,
    backgroundColor: background,
  };
});

// Hover/focus стили в зависимости от варианта оформления
const hover = computed<Css_Rule>(() => {
  const color_hover = get_color(props.color_hover);
  const background = get_color(props.background);
  const background_hover = get_color(props.background_hover);

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
      borderColor: background
    };
  }

  if (props.variant === "line") {
    return {
      color: color_hover,
      borderBottom: `${get_rem(border_width.value)} solid ${color_hover}`,
    };
  }

  return {
    color: color_hover,
    backgroundColor: background_hover,
  };
});

const focus = computed<Css_Rule>(() => {
  const color_hover = get_color("accent_5");
  const background = get_color("accent_5");
  const background_hover = get_color("accent_5");

  if (props.variant === "outline") {
    return {
      color: `${color_hover} !important`,
      border: `${get_rem(border_width.value)} solid ${color_hover} !important`,
    };
  }

  if (props.variant === "outline_alt") {
    return {
      color: `${get_color("gray_1")} !important`,
      backgroundColor: `${background} !important`,
      borderColor: `${background} !important`,
    };
  }

  if (props.variant === "line") {
    return {
      color: `${color_hover} !important`,
      borderBottom: `${get_rem(border_width.value)} solid ${color_hover} !important`,
    };
  }

  return {
    color: `${get_color("gray_1")} !important`,
    backgroundColor: `${background_hover} !important`,
  };
});

// Общие стили (применяются к label-обёртке)
const css_rule = computed<Css_Rule>(() => {
  return {
    position: "relative",
    display: "block",
    cursor: props.disabled ? "default" : "text",
    transition: `color ${TOKENS.transition}, background-color ${TOKENS.transition}, border-color ${TOKENS.transition}`,

    ...base.value,
    hover: { ...hover.value },
    focusWithin: { ...focus.value },

    ...(props.disabled ? get_disabled() : {}),
    ...props.css,
  };
});
</script>

<template>
  <Flex
    tag="label"
    :padding="padding"
    :css="css_rule"
  >
    <Text family="body" :size="props.size">
      <Text v-if="has_label" :css="css_label"><slot/></Text>
      <Style
        tag="input"
        :css="css_input"
        :type="input_type"
        :required="props.required"
        :pattern="props.pattern"
        :placeholder="props.placeholder"
        :name="props.name"
        :value="props.modelValue"
        @focus="is_focused = true"
        @blur="is_focused = false"
        @input="on_input"
      />
      <Style
        v-if="is_password"
        tag="button"
        type="button"
        :css="css_toggle"
        @click.prevent="show_password = !show_password"
      >
        <Icon :name="show_password ? 'nf-md-eye_off' : 'nf-md-eye'" />
      </Style>
    </Text>
  </Flex>
</template>