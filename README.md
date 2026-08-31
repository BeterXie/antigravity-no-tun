# Antigravity NO TUN

一个面向 Windows 的启动脚本：在存在可用本地 HTTP(S) 代理时，不需要开启 TUN 模式也能正常启动和使用 `Antigravity.exe` 图形客户端。

项目主页：[GitHub Pages](https://beterxie.github.io/antigravity-no-tun/)

## 为什么写这个脚本

我们在 Windows 上使用 Antigravity 时遇到过这样的情况：代理节点本身可用，但 Antigravity 仍然可能白屏、长时间加载，或者进入界面后语言服务无法正常连接。尤其是在切换系统代理、Clash/Mihomo 等本地代理端口和 TUN 模式时，手工排查安装路径、代理端口和进程环境比较繁琐。

实际使用中，Antigravity 不一定需要把所有流量都交给 TUN。更稳定的方式通常是：让应用的本地页面保持直连，只为需要访问外部服务的子进程提供可用的 HTTP(S) 代理。这个项目就是把这套启动流程自动化，让 Antigravity 在不开 TUN 的情况下也能使用，减少每次启动前手动切换代理和反复确认的步骤。

## 解决什么问题

- Antigravity 安装位置不固定，脚本自动寻找可执行文件。
- 不确定当前代理是否真的可用，脚本会读取已有配置并测试候选 HTTP 代理。
- 代理可能导致 `localhost`、`127.0.0.1` 等本地页面访问异常，脚本为本地地址保留直连。
- 语言服务和外部请求需要代理，脚本只对启动的 Antigravity 进程及其子进程设置代理环境。
- 没有可用 HTTP 代理时，脚本不强行修改系统设置，而是回退到系统直连或 TUN。

## NO TUN 的含义

这里的“NO TUN”指的是：当 Clash、Mihomo 或其他代理核心提供了可用的本地 HTTP(S) 代理时，Antigravity 可以不依赖 TUN 模式运行。脚本不会关闭、修改或接管用户的 TUN 设置。

如果用户只有 SOCKS5 代理、只有 TUN 路由，或者当前网络必须依赖 TUN 才能连通外部服务，脚本不会把这种环境强行变成“无 TUN”；它会跳过无法验证的 SOCKS 代理，并回退到系统直连或现有 TUN。

## 功能

- 自动识别常见安装位置、注册表 App Paths 和 `Antigravity*.exe`。
- 自动读取 `HTTP_PROXY`、`HTTPS_PROXY`、`ALL_PROXY` 和 Windows 系统代理。
- 自动探测 Clash、Mihomo、sing-box、V2Ray、Xray 等本机代理监听端口。
- 通过 Google 的轻量 `generate_204` 地址验证候选 HTTP 代理是否可用。
- 为语言服务设置当前进程代理变量。
- 让 `localhost`、`127.0.0.1` 和 `::1` 保持直连，避免本地 UI 服务被代理导致白屏。
- 启动 Electron 时使用 `--no-proxy-server`。
- 不修改系统代理，不修改 PowerShell ExecutionPolicy，不保存账号或密钥。

## 使用

1. 确保 Clash/Mihomo 或其他代理核心正在运行。
2. 从 [Releases](https://github.com/BeterXie/antigravity-no-tun/releases/latest) 下载 `Start-Antigravity.zip` 并解压。
3. 双击解压后的 `Start-Antigravity.vbs`。

这个入口使用 Windows 自带的 Windows PowerShell 5.1，不要求安装 PowerShell 7。`Start-Antigravity.vbs` 和 `Start-Antigravity.ps1` 必须放在同一个文件夹中。

请双击 `Start-Antigravity.vbs`，不要直接双击或右键运行 `.ps1`。VBS 入口会为当前 PowerShell 进程使用 Bypass，不需要手动修改执行策略。

脚本会先显示识别到的 Antigravity 路径和可用代理。首次加载可能需要等待约一分钟。

如果双击 VBS 仍被 Windows SmartScreen 或组织策略拦截，那是系统对互联网脚本的安全限制，未签名脚本无法在启动前自动移除这个限制。若要排查 `.ps1` 本身，可在可信的 PowerShell 会话中使用 `Unblock-File`；这只移除当前文件的 Internet 下载标记，不会修改执行策略。若 Antigravity 已经在运行，启动器会跳过重复启动。

脚本兼容 Windows 自带的 Windows PowerShell 5.1，也兼容 PowerShell 7，不要求额外安装 PowerShell 7。Windows 10/11 通常已经自带 Windows PowerShell 5.1。

## Antigravity CLI 登录支持

当前版本只支持启动 `Antigravity.exe` 图形界面，不包含 Antigravity CLI 登录，也不会读取、保存或代管账号凭据。CLI 登录会在未来确有需求且官方 CLI 命令明确后再单独评估。

## 代理识别顺序

1. 当前 PowerShell 进程的代理环境变量。
2. Windows 用户级 Internet Settings 中的代理。
3. 代理进程对应的本机监听端口。
4. 常见端口：`7890`、`7897`、`7898`、`7899`、`10809`、`8080`、`1080`。

只有通过 HTTP 探测的候选代理才会被采用。纯 SOCKS 地址会被跳过，因为脚本需要给 Antigravity 的语言服务提供 HTTP(S) 代理。

## 安全说明

这个脚本只对它启动的 Antigravity 进程及其子进程设置代理环境变量。它不会写入用户或系统环境变量。

脚本会执行一次网络连通性探测，请确保你理解并信任当前代理软件和代理节点。脚本本身不上传文件、不读取账号密码，也不向 GitHub 写入任何本机配置。

## 许可

本项目使用 MIT License，见 [LICENSE](LICENSE)。
