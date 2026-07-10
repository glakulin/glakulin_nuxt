// Полезные функции

import type { Component } from "vue";
import { TOKENS, type Color_Name, type Color_Scheme, type Color_Shade, type Size } from "./tokens";

// Тег или компонент для атомов
export type Tag = keyof HTMLElementTagNameMap | Component;

// Обработка чисел в css
export type Number_Rem = number | readonly number[];

const get_rem_one = (value: number): string => {
  return `${value * 0.0625}rem`;
};
const get_rem_map = (value: readonly number[]): string => {
  return value.map((i) => get_rem_one(i)).join(" ");
};

export const get_rem = (value: Number_Rem): string => {
  return typeof value === "number"
    ? get_rem_one(value)
    : get_rem_map(value);
};


// Обработка цвета в css
export const get_color = (scheme: Color_Scheme): string => {
  const [color_name, color_shade] = scheme.split("_") as [Color_Name, Color_Shade];
  return TOKENS.colors[color_name][color_shade];
};


// Текущий брейкпоинт по ширине экрана
export const get_size = (width: number): Size => {
  const screens = TOKENS.size.screen;
  const sizes = Object.entries(screens) as [Size, number][];

  let current: Size = "default";

  for (const [size, breakpoint] of sizes) {
    if (width >= breakpoint) {
      current = size;
    }
  }

  return current;
};