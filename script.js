(() => {
  const preferredLanguage = (Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || 'en';
  const isChinese = /^zh(?:-|$)/i.test(String(preferredLanguage));
  const locale = isChinese ? 'zh-CN' : 'en';

  const chineseTranslations = {
    'page.description': 'Antigravity NO TUN：当本地 HTTP(S) 代理可用时，无需开启 TUN 模式即可启动和使用 Antigravity.exe。',
    'page.title': 'Antigravity NO TUN — Windows 启动器',
    'page.skip': '跳到主要内容',
    'brand.home': 'Antigravity NO TUN 首页',
    'nav.menu': '菜单',
    'nav.main': '主导航',
    'nav.why': '为什么',
    'nav.how': '工作方式',
    'nav.scope': '范围',
    'nav.release': '版本发布',
    'nav.github': '查看 GitHub',
    'hero.eyebrow': 'WINDOWS 启动器',
    'hero.titleLine': '不开 TUN。',
    'hero.titleEm': '也能启动',
    'hero.titleName': 'Antigravity。',
    'hero.ledeBefore': '自动识别',
    'hero.ledeAfter': '和本地 HTTP(S) 代理，让本地页面保持直连，把外部服务交给已验证的代理。',
    'hero.download': '下载启动器',
    'hero.release': '查看版本',
    'hero.facts': '项目特性',
    'hero.guiOnly': '仅支持 GUI',
    'hero.noSystemChanges': '不改系统设置',
    'hero.preview': '启动检查预览',
    'hero.scroll': '向下了解',
    'mockup.ready': '就绪',
    'mockup.environmentCheck': 'Antigravity 环境检查',
    'mockup.installationDetected': '已检测到安装',
    'mockup.found': '已找到',
    'mockup.proxyVerified': 'HTTP 代理 · 已验证',
    'mockup.proxy': '代理',
    'mockup.localDirect': '本地流量 · 直连',
    'mockup.bypass': '绕过',
    'mockup.launchComplete': '启动流程完成',
    'mockup.httpProxy': 'HTTP 代理',
    'mockup.verified': '已验证',
    'mockup.tunMode': 'TUN 模式',
    'mockup.optional': '可选',
    'section.whyKicker': '01 / 为什么写它',
    'why.titleLine': '节点可用。',
    'why.titleQuestion': '为什么还是白屏？',
    'why.intro': '问题不一定在节点本身。代理软件、TUN 路由和应用本地页面共用一条链路时，流量边界不清可能让启动画面卡住，或导致语言服务连接失败。',
    'why.card1Title': '本地流量走错路径',
    'why.card1Body': '<code>localhost</code>、<code>127.0.0.1</code> 和 <code>::1</code> 应该保持直连。代理设置仍可能影响它们，导致白屏或请求超时。',
    'why.card1Foot': '本地流量 / 直连',
    'why.card2Title': '代理只配置了一半',
    'why.card2Body': '环境变量、系统代理设置和本地监听端口可能彼此不一致。启动器会读取候选项，并测试 HTTP 代理是否真正可用。',
    'why.card2Foot': '代理 / 先验证',
    'why.card3Title': '手工设置太多',
    'why.card3Body': '不用再寻找安装路径、切换 TUN 或反复试端口。启动器把识别、验证和启动合并成一次操作。',
    'why.card3Foot': '一个脚本 / 少些折腾',
    'section.howKicker': '02 / 工作方式',
    'how.title': '三步，让启动链路更干净。',
    'how.intro': '它不是代理客户端，也不会接管你的网络设置。它只为启动 Antigravity.exe 的进程准备更清晰的连接环境。',
    'how.guide': '阅读完整指南',
    'how.step1Label': '检测',
    'how.step1Title': '找到正确的应用',
    'how.step1Body': '搜索常见安装位置、注册表 App Paths 和可信的 <code>Antigravity*.exe</code> 文件。',
    'how.step1Status': '已找到',
    'how.step2Label': '验证',
    'how.step2Title': '验证可用代理',
    'how.step2Body': '读取环境变量、系统代理设置和本机端口，然后用轻量请求测试 HTTP(S) 连通性。',
    'how.step2Status': '可用',
    'how.step3Label': '启动',
    'how.step3Title': '分离本地与外部流量',
    'how.step3Body': '保持本地地址直连，只把代理环境传给启动的应用进程，不写入系统。',
    'how.step3Status': '就绪',
    'section.scopeKicker': '03 / 清晰范围',
    'scope.titleLine': 'NO TUN 是目标，',
    'scope.titleSubline': '不是绝对承诺。',
    'scope.intro': '当本地代理核心提供可用的 HTTP(S) 代理时，Antigravity 可以不依赖 TUN 模式运行。启动器不会关闭、修改或接管你的 TUN 设置。',
    'scope.included': '包含内容',
    'scope.included1': '自动识别 <code>Antigravity.exe</code>',
    'scope.included2': '寻找并验证本地 HTTP(S) 代理',
    'scope.included3': '为本地地址保留直连路径',
    'scope.included4': '兼容 Windows PowerShell 5.1 和 7',
    'scope.included5': '不修改系统代理和执行策略',
    'scope.excluded': '不包含内容',
    'scope.excluded1': 'Antigravity CLI 登录',
    'scope.excluded2': '账号、密码或 Token 管理',
    'scope.excluded3': '关闭或配置你的 TUN 模式',
    'scope.excluded4': '把纯 SOCKS5 代理转换成 HTTP 代理',
    'scope.excluded5': '替代 Clash、Mihomo 或其他代理核心',
    'section.startKicker': '准备好就开始',
    'start.title': '把启动交给一个脚本。',
    'start.intro': '下载脚本后选择“使用 PowerShell 运行”，或者在 PowerShell 中执行下面的命令。',
    'start.commandLabel': 'PowerShell 启动命令',
    'start.copyLabel': '复制启动命令',
    'start.copy': '复制',
    'start.download': '下载脚本',
    'start.source': '查看源码',
    'footer.launcherFor': 'Windows 启动器，用于',
    'footer.project': '项目',
    'footer.releases': '版本发布',
    'footer.issues': '问题反馈',
    'footer.version': '版本',
    'footer.guiOnly': '仅 GUI',
    'footer.noTun': 'NO TUN 模式',
    'footer.tagline': '让启动更从容。'
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
