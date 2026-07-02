// Полезные функции

import { TOKENS, type Color_Name, type Color_Scheme, type Color_Shade } from "./tokens";

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