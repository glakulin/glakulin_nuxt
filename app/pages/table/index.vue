<!-- Выбор таблицы -->

<script setup lang="ts">
import { NuxtLink } from '#components';
import { Flex, Icon } from '~/components/atoms';
import { Button } from '~/components/molecules';

// Таблицы
type Table = {
  name: string;
  href: string;
  icon: string;
};
const tables: Table[] = [
  { name: "games", href: "/table/games", icon: "nf-fa-gamepad" }
];

</script>

<template>
  <Flex wrap="wrap">
    <Button v-for="table in tables" :tag="NuxtLink" :href="table.href" size="xl"><Icon :name="table.icon" />{{ table.name }}</Button>
  </Flex>
</template>