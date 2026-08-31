(() => {
  const preferredLanguage = (Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || 'en';
  const isChinese = /^zh(?:-|$)/i.test(String(preferredLanguage));
  const locale = isChinese ? 'zh-CN' : 'en';

  const chineseTranslations = {
    'page.description': 'Antigravity NO TUN：本地 HTTP(S) 代理可用时，在 Windows 上不开 TUN 启动 Antigravity.exe。',
    'page.title': 'Antigravity NO TUN — Antigravity.exe Windows 启动器',
    'page.skip': '跳到主要内容',
    'brand.home': 'Antigravity NO TUN 首页',
    'nav.menu': '菜单',
    'nav.main': '主导航',
    'nav.why': '为什么',
    'nav.how': '工作方式',
    'nav.scope': '范围',
    'nav.release': '版本发布',
    'nav.github': '查看 GitHub',
    'hero.eyebrow': 'WINDOWS / 启动器',
    'hero.titleLine': '不开 TUN。',
    'hero.titleEm': '启动',
    'hero.titleName': 'Antigravity。',
    'hero.ledeBefore': '自动找到',
    'hero.ledeAfter': '和可用的本地 HTTP(S) 代理。让本地地址直连，再把代理传给 Antigravity。',
    'hero.download': '下载启动包',
    'hero.release': '查看版本',
    'hero.facts': '项目要点',
    'hero.guiOnly': '仅支持 GUI',
    'hero.noSystemChanges': '不改系统设置',
    'hero.preview': '启动检查示意',
    'hero.scroll': '查看工作方式',
    'mockup.ready': '就绪',
    'mockup.environmentCheck': '检查 Antigravity',
    'mockup.installationDetected': '已找到应用',
    'mockup.found': '已找到',
    'mockup.proxyVerified': 'HTTP 代理 · 有响应',
    'mockup.proxy': '代理',
    'mockup.localDirect': '本地地址 · 直连',
    'mockup.bypass': '直连',
    'mockup.launchComplete': '可以启动',
    'mockup.httpProxy': 'HTTP 代理',
    'mockup.verified': '可用',
    'mockup.tunMode': 'TUN 模式',
    'mockup.optional': '不需要',
    'section.whyKicker': '01 / 为什么需要这个脚本',
    'why.titleLine': '代理能用。',
    'why.titleQuestion': 'Antigravity 还是白屏。',
    'why.intro': '即使代理能用，Antigravity 仍可能白屏。代理接管 localhost 时，语言服务也可能连不上。',
    'why.card1Title': '本地流量要直连',
    'why.card1Body': '<code>localhost</code>、<code>127.0.0.1</code> 和 <code>::1</code> 应该绕过代理。代理接管这些地址时，本地页面可能超时或变成白屏。',
    'why.card1Foot': '本地流量 / 直连',
    'why.card2Title': '应用需要可用的 HTTP 代理',
    'why.card2Body': '脚本会检查环境变量、Windows 代理设置和常见本地端口。只有 HTTP 请求成功，候选代理才会被使用。',
    'why.card2Foot': '代理 / 先测试',
    'why.card3Title': '查找、测试、启动',
    'why.card3Body': '脚本一次完成路径查找、代理测试和应用启动。',
    'why.card3Foot': '一个脚本 / 三步完成',
    'section.howKicker': '02 / 它做什么',
    'how.title': '找到应用，测试代理，启动 Antigravity。',
    'how.intro': '脚本只给它启动的 Antigravity 进程设置代理变量。系统代理和 TUN 设置保持原样。',
    'how.guide': '阅读完整指南',
    'how.step1Label': '查找',
    'how.step1Title': '找到 Antigravity.exe',
    'how.step1Body': '检查常见安装目录、App Paths 和符合条件的 <code>Antigravity*.exe</code> 路径。',
    'how.step1Status': '已找到',
    'how.step2Label': '测试',
    'how.step2Title': '测试代理',
    'how.step2Body': '检查环境变量、Windows 代理设置和本机端口，然后发送一次轻量 HTTP 请求。',
    'how.step2Status': '可用',
    'how.step3Label': '启动',
    'how.step3Title': '启动应用',
    'how.step3Body': '让 <code>localhost</code>、<code>127.0.0.1</code> 和 <code>::1</code> 直连，再把选中的代理传给 Antigravity。',
    'how.step3Status': '就绪',
    'section.scopeKicker': '03 / 范围',
    'scope.titleLine': '不开 TUN 的前提是',
    'scope.titleSubline': '本地 HTTP(S) 代理有响应。',
    'scope.intro': '启动器会把可用代理配置传给 Antigravity，并让本地地址保持直连。你的 TUN 设置不会被改动。',
    'scope.included': '它会做什么',
    'scope.included1': '自动找到 <code>Antigravity.exe</code>',
    'scope.included2': '检查本地 HTTP(S) 代理',
    'scope.included3': '让本地地址保持直连',
    'scope.included4': '支持 Windows PowerShell 5.1 和 7',
    'scope.included5': '保持系统代理和执行策略不变',
    'scope.excluded': '脚本不处理',
    'scope.excluded1': 'Antigravity CLI 登录',
    'scope.excluded2': '账号、密码或 Token 管理',
    'scope.excluded3': '修改 TUN 设置',
    'scope.excluded4': '把 SOCKS5 转成 HTTP',
    'scope.excluded5': '替代 Clash、Mihomo 或其他代理核心',
    'section.startKicker': '从这里开始',
    'start.title': '双击一次即可启动。',
    'start.intro': '下载启动包，解压后双击 Start-Antigravity.vbs。压缩包里已经包含 PowerShell 脚本。',
    'start.note': 'VBS 启动入口使用 Windows PowerShell 5.1，不需要安装 PowerShell 7。两个文件需要放在同一个文件夹中。',
    'start.commandLabel': '一键启动文件',
    'start.copyLabel': '复制启动文件名',
    'start.copy': '复制',
    'start.download': '下载启动包',
    'start.source': '查看源码',
    'footer.launcherFor': 'Windows 启动器，用于',
    'footer.project': '项目',
    'footer.releases': '版本发布',
    'footer.issues': '问题反馈',
    'footer.version': '版本',
    'footer.guiOnly': '仅 GUI',
    'footer.noTun': 'NO TUN 模式',
    'footer.tagline': '找到应用，测试代理，然后启动。'
  };

  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;

  if (isChinese) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = chineseTranslations[element.dataset.i18n];
      if (value !== undefined) element.innerHTML = value;
    });

    document.querySelectorAll('[data-i18n-content]').forEach((element) => {
      const value = chineseTranslations[element.dataset.i18nContent];
      if (value !== undefined) element.setAttribute('content', value);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const value = chineseTranslations[element.dataset.i18nAriaLabel];
      if (value !== undefined) element.setAttribute('aria-label', value);
    });
  }

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
  const copyLabels = isChinese
    ? { copy: '复制', copyLabel: '复制启动命令', copied: '已复制', feedback: '命令已复制到剪贴板。', manual: '请手动复制' }
    : { copy: 'Copy', copyLabel: 'Copy launch command', copied: 'Copied', feedback: 'Command copied to the clipboard.', manual: 'Copy manually' };

  if (copyButton && copyFeedback) {
    copyButton.addEventListener('click', async () => {
      const value = copyButton.dataset.copy;

      try {
        await navigator.clipboard.writeText(value);
        copyButton.textContent = copyLabels.copied;
        copyButton.setAttribute('aria-label', copyLabels.copied);
        copyFeedback.textContent = copyLabels.feedback;
      } catch {
        copyFeedback.textContent = `${copyLabels.manual}: ${value}`;
      }

      window.setTimeout(() => {
        copyButton.textContent = copyLabels.copy;
        copyButton.setAttribute('aria-label', copyLabels.copyLabel);
        copyFeedback.textContent = '';
      }, 2200);
    });
  }

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
