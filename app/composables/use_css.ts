// Хук для css-in-js

import type { CSSProperties } from "vue";
import { get_rem, type Number_Rem } from "~/utilities";

// Значения css
export type Css_Value = string | null | undefined | false | Number_Rem;
export type Css_Pseudo = "hover" | "focus" | "active" | "visited" | "disabled" | "checked" | "focusVisible" | "focusWithin";

type Css_Base_Rule = { [key in keyof CSSProperties]?: CSSProperties[key] | Css_Value };
type Css_Pseudo_Rule = { [key in Css_Pseudo]?: Css_Rule };
type Css_Media_Rule = { [key in `@media${string}`]?: Css_Rule }

export type Css_Rule = Css_Base_Rule & Css_Pseudo_Rule & Css_Media_Rule;

// Настройки
const STYLE_ID = "use-css";
const UNITLESS_PROPERTIES = new Set([
  "animation-iteration-count", 
  "aspect-ratio", 
  "border-image-outset", "border-image-slice", "border-image-width",
  "box-flex", "box-flex-group", "box-ordinal-group",
  "column-count", "columns",
  "flex", "flex-grow", "flex-positive", "flex-shrink", "flex-negative", "flex-order",
  "grid-area", "grid-column", "grid-column-end", "grid-column-start", "grid-row", "grid-row-end", "grid-row-start",
  "line-clamp", "line-height",
  "opacity",
  "order",
  "orphans",
  "scale",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
  "font-weight"
]);

const PSEUDO_KEYS = new Set<Css_Pseudo>([
  "hover",
  "focus",
  "active",
  "visited",
  "disabled",
  "checked",
  "focusVisible",
  "focusWithin"
]);

// Хэширование строки
const get_hash = (value: string): string => {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
};

// Свойство в css формат
const get_css_property = (value: string): string => {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
};

// Значение в css формат
const get_css_value = (property: string, value: string | number | readonly number[]): string => {
  if (typeof value === "number") {
    return value === 0 || UNITLESS_PROPERTIES.has(property)
      ? String(value)
      : get_rem(value);
  }

  if (typeof value === "string") {
    return value;
  }

  return get_rem(value);
};

// Ключ правила
const get_rule_key = (media: string, selector: string, property: string, value: string): string => {
  return `${media}${selector}|${property}:${value}`;
};

// Селектор псевдо
const get_selector = (value: string): string => {
  return value.startsWith(":")
    ? value
    : `:${get_css_property(value)}`;
};

// Имя класса
const get_class_name = (rule_key: string): string => {
  return `gla_${get_hash(rule_key)}`;
};

// Css правило
const get_rule = (class_name: string, media: string, selector: string, property: string, value: string): string => {
  const rule = `.${class_name}${selector}{${property}:${value}}`;

  return media ? `${media}{${rule}}` : rule;
};

// Css-in-js
export const use_css = () => {
  const rules = useState<Record<string, string>>("use_css_rules", () => ({}));
  const css_text = useState("use_css_text", () => "");

  // Вставка атомарного правила
  const insert_css_rule = (class_names: string[], media: string, selector: string, property: string, value: string): void => {
    const rule_key = get_rule_key(media, selector, property, value);
    const class_name = get_class_name(rule_key);
    const cached_rule = rules.value[rule_key];

    class_names.push(class_name);

    if (cached_rule) {
      return;
    }

    const rule = get_rule(class_name, media, selector, property, value);

    rules.value[rule_key] = rule;
    css_text.value += rule;
  };

  // Вставка объекта стилей
  const insert_css_rules = (class_names: string[], css_rule: Css_Rule, selector = "", media = ""): void => {
    for (const [raw_property, raw_value] of Object.entries(css_rule)) {
      if (raw_value === null || raw_value === undefined || raw_value === false) {
        continue;
      }

      // Обработка @media запросов
      if (raw_property.startsWith("@media")) {
        // Извлекаем сам запрос, убирая слово "@media"
        const media_query = raw_property.replace("@media", "").trim();
        // Если уже есть медиа-запрос (вложенность), объединяем их через "and"
        const combined_media = media ? `${media} and ${media_query}` : raw_property;
        
        insert_css_rules(class_names, raw_value as Css_Rule, selector, combined_media);
        continue;
      }

      // Обработка псевдоклассов и вложенных объектов
      if (typeof raw_value === "object" && !Array.isArray(raw_value)) {
        insert_css_rules(class_names, raw_value as Css_Rule, `${selector}${get_selector(raw_property)}`);
        continue;
      }

      const property = get_css_property(raw_property);
      const value = get_css_value(property, raw_value);

      insert_css_rule(class_names, media, selector, property, value);
    }
  };

  // Синхронизация стилей с DOM. Элемент <style> создаётся и обновляется
  // напрямую, вне жизненного цикла компонентов, поэтому он не удаляется
  // при SPA-навигации и стили сохраняются между страницами.
  const sync_dom = (): void => {
    if (!import.meta.client) return;

    let style_el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

    if (!style_el) {
      style_el = document.createElement("style");
      style_el.id = STYLE_ID;
      document.head.appendChild(style_el);
    }

    style_el.textContent = css_text.value;
  };

  return (css_rule: Css_Rule): string => {
    const class_names: string[] = [];
    
    insert_css_rules(class_names, css_rule);

    // Синхронизируем стили с DOM после вставки всех правил компонента
    // (актуально при SPA-навигации между страницами)
    sync_dom();

    return class_names.join(" ");
  };
};
