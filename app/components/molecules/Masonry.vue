<!-- Компонент для masonry-раскладки -->

<script setup lang="ts">
import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  Text,
  type ComponentPublicInstance,
  type CSSProperties as CSSP,
  type PropType,
  type VNode
} from "vue";
import { type Number_Rem } from "~/utilities";
import { Flex, Grid } from "../atoms";
import { type Css_Rule } from "~/composables/use_css";

// Тип для элемента
type Masonry_Item = {
  index: number;
  node: VNode;
  width: number;
  height: number;
};

// Свойства
const props = withDefaults(defineProps<{
  mode: "vertical" | "horizontal" // Режим
  columns?: number; // Количество колонок
  rows?: number; // Количество строк

  justify_items?: CSSP["justifyItems"]; // Выравнивание элементов по горизонтали
  align_items?: CSSP["alignItems"]; // Выравнивание элементов по вертикали

  gap?: Number_Rem; // Промежуток
  padding?: Number_Rem; // Отступы
  radius?: Number_Rem; // Скругление
  css?: Css_Rule; // Дополнительные стили
}>(), {
  // Значения по умолчанию
  columns: 1,
  rows: 1
});

const slots = useSlots();

// Состояние
const container_ref = ref<HTMLElement | null>(null);
const measure_refs = ref<HTMLElement[]>([]);
const groups = shallowRef<VNode[][]>([]);
const is_measuring = ref(true);
const layout_version = ref(0);
const last_signature = ref("");

let frame_id: number | null = null;

// Компонент для вывода vnode
const Render_Node = defineComponent({
  props: {
    node: {
      type: Object as PropType<VNode>,
      required: true
    }
  },
  setup(render_props) {
    return () => cloneVNode(render_props.node);
  }
});

// Свойства в стили
const css = use_css();

// Элементы слота
const slot_items = computed(() => {
  const items = slots.default?.() ?? [];
  return get_flat_nodes(items);
});

// Количество групп
const group_count = computed(() => {
  const count = props.mode === "vertical" ? props.columns : props.rows;
  return Math.max(1, Math.floor(count));
});

// Стили контейнера
const container_css = computed<Css_Rule>(() => ({
  position: "relative",
  ...props.css
}));

// Стили измерительного слоя
const measure_class_name = computed(() => css({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  visibility: "hidden",
  pointerEvents: "none",
  zIndex: -1
}));

// Стили видимой группы
const group_css = {
  minWidth: 0
} as const;

// Ширина элемента при измерении
const measure_width = computed(() => {
  if (props.mode !== "vertical") return undefined;

  const element = container_ref.value;
  if (!element) return undefined;

  const width = element.getBoundingClientRect().width;
  const gap = get_gap_px();
  const count = group_count.value;
  const column_width = (width - gap * (count - 1)) / count;

  return `${Math.max(0, column_width)}px`;
});

// Стили элемента при измерении
const measure_item_style = computed<CSSP>(() => ({
  width: measure_width.value
}));

// Получение плоского списка узлов
const get_flat_nodes = (nodes: VNode[]): VNode[] => {
  const result: VNode[] = [];

  nodes.forEach((node) => {
    if (node.type === Comment) return;

    if (node.type === Text && String(node.children ?? "").trim() === "") return;

    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...get_flat_nodes(node.children as VNode[]));
      return;
    }

    result.push(node);
  });

  return result;
};

// Получение минимальной группы
const get_min_index = (sizes: number[]): number => {
  let min_index = 0;

  for (let i = 1; i < sizes.length; i++) {
    const size = sizes[i] ?? 0;
    const min_size = sizes[min_index] ?? 0;

    if (size < min_size) min_index = i;
  }

  return min_index;
};

// Проверка измеренного элемента
const is_masonry_item = (item: Masonry_Item | null): item is Masonry_Item => {
  return item !== null;
};

// Распределение элементов по группам
const distribute_items = (items: Masonry_Item[]): VNode[][] => {
  const count = group_count.value;
  const result = Array.from({ length: count }, () => [] as VNode[]);
  const sizes = Array.from({ length: count }, () => 0);
  const gap = get_gap_px();

  items.forEach((item) => {
    const group_index = get_min_index(sizes);
    const group = result[group_index];
    const group_size = sizes[group_index];
    const size = props.mode === "vertical" ? item.height : item.width;

    if (group === undefined || group_size === undefined) return;

    group.push(item.node);
    sizes[group_index] = group_size + size + gap;
  });

  return result;
};

// Получение промежутка в пикселях
const get_gap_px = (): number => {
  if (props.gap === undefined) return 0;

  const value = Array.isArray(props.gap) ? props.gap[0] : props.gap;
  const font_size = get_root_font_size();

  return value * font_size * 0.0625;
};

// Получение размера шрифта корня
const get_root_font_size = (): number => {
  if (!import.meta.client) return 16;

  const value = window.getComputedStyle(document.documentElement).fontSize;
  const size = Number.parseFloat(value);

  return Number.isFinite(size) ? size : 16;
};

// Создание подписи размеров
const get_signature = (items: Masonry_Item[]): string => {
  const element = container_ref.value;
  const width = element?.getBoundingClientRect().width ?? 0;
  const sizes = items.map((item) => `${item.width}:${item.height}`).join("|");

  return `${props.mode}|${group_count.value}|${width}|${sizes}`;
};

// Установка ref контейнера
const set_container_ref = (element: Element | ComponentPublicInstance | null): void => {
  if (element instanceof HTMLElement) {
    container_ref.value = element;
    return;
  }

  const component_element = (element as ComponentPublicInstance | null)?.$el;
  container_ref.value = component_element instanceof HTMLElement ? component_element : null;
};

// Установка ref измеряемого элемента
const set_measure_ref = (element: Element | null, index: number): void => {
  if (!(element instanceof HTMLElement)) return;
  measure_refs.value[index] = element;
};

// Планирование перераскладки
const schedule_layout = (): void => {
  if (!import.meta.client) return;
  if (frame_id !== null) return;

  frame_id = window.requestAnimationFrame(() => {
    frame_id = null;
    void recalculate_layout();
  });
};

// Перерасчёт раскладки
const recalculate_layout = async (): Promise<void> => {
  if (!import.meta.client) return;

  const element = container_ref.value;
  if (!element) return;

  if (element.getBoundingClientRect().width <= 0) return;

  is_measuring.value = true;
  layout_version.value++;
  measure_refs.value = [];

  await nextTick();

  const items = measure_refs.value.map((item, index): Masonry_Item | null => {
    const node = slot_items.value[index];
    if (node === undefined) return null;

    const rect = item.getBoundingClientRect();

    return {
      index,
      node,
      width: rect.width,
      height: rect.height
    };
  }).filter(is_masonry_item);

  const signature = get_signature(items);

  if (signature !== last_signature.value) {
    groups.value = distribute_items(items);
    last_signature.value = signature;
  }

  is_measuring.value = false;
};

watch([
  () => props.mode,
  () => props.columns,
  () => props.rows,
  () => props.gap,
  () => slot_items.value.length
], schedule_layout);

onMounted(() => {
  schedule_layout();
});

onBeforeUnmount(() => {
  if (frame_id !== null) window.cancelAnimationFrame(frame_id);
});
</script>

<template>
  <Grid
    :ref="set_container_ref"
    :template_columns="props.mode === 'vertical' ? `repeat(${group_count}, minmax(0, 1fr))` : undefined"
    :template_rows="props.mode === 'horizontal' ? `repeat(${group_count}, auto)` : undefined"
    :auto_flow="props.mode === 'horizontal' ? 'column' : undefined"
    :justify_items="props.justify_items"
    :align_items="props.align_items"
    :gap="props.gap"
    :padding="props.padding"
    :radius="props.radius"
    :css="container_css"
  >
    <template v-if="!is_measuring">
      <Flex
        v-for="(group, group_index) in groups"
        :key="group_index"
        :direction="props.mode === 'vertical' ? 'column' : 'row'"
        :gap="props.gap"
        :css="group_css"
      >
        <Render_Node
          v-for="(item, item_index) in group"
          :key="item.key ?? item_index"
          :node="item"
        />
      </Flex>
    </template>

    <div
      v-else
      :key="layout_version"
      :class="measure_class_name"
    >
      <div
        v-for="(item, item_index) in slot_items"
        :key="item.key ?? item_index"
        :ref="(element) => set_measure_ref(element as Element | null, item_index)"
        :style="measure_item_style"
      >
        <Render_Node :node="item" />
      </div>
    </div>
  </Grid>
</template>
