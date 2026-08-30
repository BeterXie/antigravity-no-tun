# Antigravity Windows Launcher

一个面向 Windows 的 PowerShell 7 启动脚本，帮助 Antigravity 在本机代理环境下稳定启动。

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

需要 PowerShell 7。如果系统先用 Windows PowerShell 打开脚本，脚本会自动转交给 `pwsh.exe`。

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
