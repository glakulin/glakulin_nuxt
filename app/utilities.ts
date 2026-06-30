// Полезные функции

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