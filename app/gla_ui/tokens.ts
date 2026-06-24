// Токены для цветов, шрифтов и размеров

import { reactive } from "vue";
import tokens_data from "./tokens.json";

export const tokens = reactive(tokens_data);

// Кастомный тип для числовых значений
export type Num_Values = [number] | [number, number] | [number, number, number] | [number, number, number, number];
// Функция для его обработки
export function get_nums(nums: Num_Values): string {
  if (!Array.isArray(nums)) {
    return '0rem';
  }
  const rem = tokens.rem || 16;
  return nums.map((num) => `${num * rem}rem`).join(" ");
}
