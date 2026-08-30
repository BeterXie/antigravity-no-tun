(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteMenu = document.querySelector('#site-menu');

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const copyButton = document.querySelector('[data-copy]');
  const copyFeedback = document.querySelector('.copy-feedback');

  if (copyButton && copyFeedback) {
    copyButton.addEventListener('click', async () => {
      const value = copyButton.dataset.copy;

      try {
        await navigator.clipboard.writeText(value);
        copyButton.textContent = '已复制';
        copyFeedback.textContent = '命令已复制到剪贴板。';
      } catch {
        copyFeedback.textContent = `请手动复制：${value}`;
      }

      window.setTimeout(() => {
        copyButton.textContent = '复制';
        copyFeedback.textContent = '';
      }, 2200);
    });
  }

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
