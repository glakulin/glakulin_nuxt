<script setup lang="ts">
import { get_color, transition, type Color } from '~/gla_ui/tokens';

const props = withDefaults(defineProps<{
  color?: Color;
  color_hover?: Color;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}>(), {
  color: "gray-1",
  color_hover: "gray-3",
  href: "#",
  target: "_self"
});

const link_styles = use_css(() => ({
  color: get_color(props.color),
  transition: `color ${transition}`,
  ":hover": {
    color: get_color(props.color_hover),
    cursor: "pointer"
  }
}))
</script>

<template>
  <NuxtLink
    :class="link_styles"
    :href="props.href"
    :target="props.target"
  >
    <slot />
  </NuxtLink>
</template>