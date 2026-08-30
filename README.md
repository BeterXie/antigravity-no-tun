# Antigravity Windows Launcher

一个面向 Windows 的 PowerShell 启动脚本，帮助 Antigravity 在本机代理环境下稳定启动。

## 为什么写这个脚本

我们在 Windows 上使用 Antigravity 时遇到过这样的情况：代理节点本身可用，但 Antigravity 仍然可能白屏、长时间加载，或者进入界面后语言服务无法正常连接。尤其是在切换系统代理、Clash/Mihomo 等本地代理端口和 TUN 模式时，手工排查安装路径、代理端口和进程环境比较繁琐。

实际使用中，Antigravity 不一定需要把所有流量都交给 TUN。更稳定的方式通常是：让应用的本地页面保持直连，只为需要访问外部服务的子进程提供可用的 HTTP(S) 代理。这个项目就是把这套启动流程自动化，减少每次启动前手动切换代理和反复确认的步骤。

## 解决什么问题

- Antigravity 安装位置不固定，脚本自动寻找可执行文件。
- 不确定当前代理是否真的可用，脚本会读取已有配置并测试候选 HTTP 代理。
- 代理可能导致 `localhost`、`127.0.0.1` 等本地页面访问异常，脚本为本地地址保留直连。
- 语言服务和外部请求需要代理，脚本只对启动的 Antigravity 进程及其子进程设置代理环境。
- 没有可用 HTTP 代理时，脚本不强行修改系统设置，而是回退到系统直连或 TUN。

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
2. 下载 `Start-Antigravity.ps1`。
3. 右键脚本，选择“使用 PowerShell 运行”。

脚本会先显示识别到的 Antigravity 路径和可用代理。首次加载可能需要等待约一分钟。

脚本兼容 Windows 自带的 Windows PowerShell 5.1，也兼容 PowerShell 7，不要求额外安装 PowerShell 7。Windows 10/11 通常已经自带 Windows PowerShell 5.1。

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
