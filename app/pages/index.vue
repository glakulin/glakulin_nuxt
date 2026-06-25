<script setup lang="ts">
import { Masonry } from "~/gla_ui/components";
</script>

<template>
  <Masonry direction="vertical" :columns="2" :gap="[10]">
    <div :style="{ height: '120px', backgroundColor: 'red' }">Item 1</div>
    <div :style="{ height: '220px', backgroundColor: 'blue' }">Item 2</div>
    <div :style="{ height: '150px', backgroundColor: 'green' }">Item 3</div>
    <div :style="{ height: '100px', backgroundColor: 'yellow' }">Item 4</div>
  </Masonry>
  <Masonry direction="horizontal" :rows="2" :gap="[10]">
    <div :style="{ width: '120px', backgroundColor: 'red' }">Item 1</div>
    <div :style="{ width: '220px', backgroundColor: 'blue' }">Item 2</div>
    <div :style="{ width: '150px', backgroundColor: 'green' }">Item 3</div>
    <div :style="{ width: '100px', backgroundColor: 'yellow' }">Item 4</div>
  </Masonry>
</template>
