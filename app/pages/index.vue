<script setup lang="ts">
import Text from "~/gla_ui/components/atom/Text.vue";
import Flex from "~/gla_ui/components/atom/Flex.vue";
import Grid from "~/gla_ui/components/atom/Grid.vue";
import Masonry from "~/gla_ui/components/atom/Masonry.vue";
import { tokens, type Size } from "~/gla_ui/tokens";

// Для демо шрифтов
const sizes = Object.keys(tokens.typography.body.size);
const font_groups: {
  family: "body" | "heading",
  label: string,
  mono: boolean,
}[] = [
    { family: 'heading', label: 'Heading', mono: false },
    { family: 'body', label: 'Body', mono: false },
    { family: 'body', label: 'Mono', mono: true },
    { family: 'heading', label: 'MonoBIG', mono: true },
  ];

// Для демо цветов
const color_groups = Object.entries(tokens.colors).map(([name, colors]) => ({
  name,
  colors: colors as Record<string, string>
}));
</script>

<template>
  <Flex :gap="[20]" wrap="wrap">
    <!-- Демо шрифтов -->
    <Flex :gap="[12]">
      <Flex v-for="group in font_groups" :key="group.label" direction="column" :gap="[4]">
        <Text v-for="size in sizes" :key="size" :family="group.family" :size="size as Size"
          :class="{ mono: group.mono }">
          {{ group.label }}_{{ size }}
        </Text>
      </Flex>
    </Flex>

    <!-- Демо цветов -->
    <Masonry direction="horizontal" :rows="3" :gap="[12]">
      <Grid columns="auto auto auto" :gap="[4]" v-for="group in color_groups" :key="group.name">
        <Flex v-for="(color, shade) in group.colors" :key="`${color}_${shade}`" :style="{ backgroundColor: color }"
          :padding="[4]" :radius="[2]">
          <Text size="xs" :style="{ color: `var(--colors-gray-${(+shade < 5) ? '9' : '1'})` }">
            {{ group.name }}_{{ shade }}
          </Text>
        </Flex>
      </Grid>
    </Masonry>
  </Flex>
</template>
