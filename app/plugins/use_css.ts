// Плагин регистрирует <style id="use-css"> на уровне приложения (один раз),
// вне жизненного цикла компонентов. Благодаря этому тег не удаляется при
// SPA-навигации, и сгенерированные use_css стили сохраняются между страницами.
// Работает и на сервере, чтобы стили попадали в исходный HTML.

export default defineNuxtPlugin(() => {
  const css_text = useState<string>("use_css_text", () => "");

  useHead({
    style: [
      {
        id: "use-css",
        textContent: css_text
      }
    ]
  });
});
