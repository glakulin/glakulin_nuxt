// Статические данные для ссылок

// Тип ссылки
type Link = {
  label: string;
  href: string;
  icon: string;
}

// Список страниц
export const PAGES: Link[] = [
  { label: "Главная", href: "/", icon: "nf-md-home" }
];

// Список соцсетей
export const SOCIALS: Link[] = [
  { label: "Telegram", href: "https://t.me/", icon: "nf-fa-telegram" }
];