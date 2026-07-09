<!-- Страница обработки ошибок -->

<script setup lang="ts">
import { type Css_Rule } from "~/composables/use_css";
import { Flex, Icon, Text } from "~/components/atoms";
import { Link } from "~/components/molecules";
import { get_color, get_rem } from "~/utilities";

// Свойства ошибки, передаваемые Nuxt
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
    message?: string;
  };
}>();

// Возврат на главную с очисткой ошибки
const handle_home = () => {
  clearError({ redirect: "/" });
};

// Стили обёртки (на весь экран, по центру)
const css_rule_wrapper = computed<Css_Rule>(() => ({
  minHeight: "100vh",
  width: "100%",
  backgroundColor: get_color("gray_9")
}));
</script>

<template>
  <Flex tag="main" :css="css_rule_wrapper" direction="column" align_items="center" justify_content="center" :gap="16">
    <!-- Код ошибки -->
    <Text tag="h1" family="heading" size="xl" color="error_3">
      {{ props.error.statusCode }}
    </Text>

    <!-- Сообщение -->
    <Text tag="p" family="body" size="sm" color="gray_4" :css="{ textAlign: 'center' }">
      {{ props.error.statusMessage || props.error.message || "Произошла непредвиденная ошибка" }}
    </Text>

    <!-- Ссылка на главную -->
    <Link href="/" color="gray_1" color_hover="gray_3" @click.prevent="handle_home">
      <Text family="body" size="sm">
        <Flex :gap="6"><Icon name="nf-md-home" />На главную</Flex>
      </Text>
    </Link>
  </Flex>
</template>
