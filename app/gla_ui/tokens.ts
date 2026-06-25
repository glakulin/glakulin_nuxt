// Токены для цветов, шрифтов и размеров

import { reactive } from "vue";
import tokens_data from "./tokens.json";
import type { Property } from "csstype"; // Библиотека для типов из css

export const tokens = reactive(tokens_data);

// Кастомный тип для числовых значений
export type Num_Values = [number] | [number, number] | [number, number, number] | [number, number, number, number];

// Тип для названий размеров
export type Size = "default" | "xs" | "sm" | "md" | "lg" | "xl";

// Функция для обработки `Num_Values`
export function get_nums(nums: Num_Values): string {
  if (!Array.isArray(nums)) {
    return '0rem';
  }
  const rem = tokens.rem || 16;
  return nums.map((num) => `${num * rem}rem`).join(" ");
}

// Кастомный тип для цветов
type Shade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Color = `${keyof typeof tokens.colors}-${Shade}` | Property.Color;

// Функция для получения цвета по имени и оттенку
export function get_color(color: Color): string {
  if (color.includes("-")) {
    const [color_name, shade_str] = color.split("-") as [keyof typeof tokens.colors, string];
    const shade = parseInt(shade_str) as Shade;
    return tokens.colors[color_name][shade];
  }
  return color;
}