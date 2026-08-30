$ErrorActionPreference = 'Stop'

# Compatible with the built-in Windows PowerShell 5.1 and PowerShell 7.
# The script does not change the machine or user ExecutionPolicy.

$proxyProbeUrl = 'https://www.googleapis.com/generate_204'
$noProxyHosts = @('localhost', '127.0.0.1', '::1')
$proxyCandidates = [System.Collections.Generic.List[object]]::new()

function Add-ProxyCandidate {
    param(
        [System.Collections.Generic.List[object]]$List,
        [string]$Value,
        [string]$Source
    )

    if ([string]::IsNullOrWhiteSpace($Value)) { return }

    foreach ($part in ($Value -split ';')) {
        $endpoint = $part.Trim().Trim('"').Trim("'")
        if ([string]::IsNullOrWhiteSpace($endpoint)) { continue }

        if ($endpoint -match '^(?i:http|https)\s*=\s*(.+)$') {
            $endpoint = $Matches[1].Trim()
        } elseif ($endpoint -match '^(?i:socks|socks5|socks5h)\s*=\s*(.+)$') {
            continue
        }

        if ($endpoint -match '^(?i:socks5h?|socks)://') {
            continue
        }

        $uri = $null
        try {
            if ($endpoint -notmatch '^(?i:https?)://') {
                $endpoint = "http://$endpoint"
            }

            $parsed = [System.Uri]$endpoint
            if (-not $parsed.IsAbsoluteUri -or $parsed.Port -le 0) { continue }
            if ($parsed.Scheme -notin @('http', 'https')) { continue }
            $uri = $parsed.AbsoluteUri.TrimEnd('/')
        } catch {
            continue
        }

        if (-not ($List | Where-Object { $_.Uri -eq $uri })) {
            [void]$List.Add([pscustomobject]@{
                Uri    = $uri
                Source = $Source
            })
        }
    }
}

function Get-ProxyLabel {
    param([string]$Uri)

    try {
        $parsed = [System.Uri]$Uri
        return "{0}:{1}" -f $parsed.Host, $parsed.Port
    } catch {
        return $Uri
    }
}

function Resolve-AntigravityExecutable {
    $paths = [System.Collections.Generic.List[string]]::new()
    $roots = [System.Collections.Generic.List[string]]::new()

    foreach ($root in @(
        (Join-Path $env:LOCALAPPDATA 'Programs'),
        $env:ProgramFiles,
        ${env:ProgramFiles(x86)}
    )) {
        if (-not [string]::IsNullOrWhiteSpace($root) -and (Test-Path -LiteralPath $root -PathType Container)) {
            if (-not $roots.Contains($root)) { [void]$roots.Add($root) }
        }
    }

    foreach ($root in $roots) {
        foreach ($relative in @(
            'Antigravity\Antigravity.exe',
            'Antigravity\Antigravity IDE.exe',
            'Antigravity.exe'
        )) {
            $candidate = Join-Path $root $relative
            if ((Test-Path -LiteralPath $candidate -PathType Leaf) -and (-not $paths.Contains($candidate))) {
                [void]$paths.Add($candidate)
            }
        }

        Get-ChildItem -LiteralPath $root -Filter 'Antigravity*.exe' -File -Recurse -Depth 4 -ErrorAction SilentlyContinue |
            ForEach-Object {
                if (-not $paths.Contains($_.FullName)) { [void]$paths.Add($_.FullName) }
            }
    }

    foreach ($key in @(
        'HKCU:\Software\Microsoft\Windows\CurrentVersion\App Paths\Antigravity.exe',
        'HKLM:\Software\Microsoft\Windows\CurrentVersion\App Paths\Antigravity.exe',
        'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\App Paths\Antigravity.exe'
    )) {
        if (Test-Path -LiteralPath $key) {
            try {
                $registeredPath = (Get-Item -LiteralPath $key).GetValue('')
                if ($registeredPath -and (Test-Path -LiteralPath $registeredPath -PathType Leaf) -and -not $paths.Contains($registeredPath)) {
                    [void]$paths.Add($registeredPath)
                }
            } catch {
                # Ignore inaccessible or malformed registry entries.
            }
        }
    }

    $valid = foreach ($path in $paths) {
        try {
            $item = Get-Item -LiteralPath $path -ErrorAction Stop
            $version = [System.Diagnostics.FileVersionInfo]::GetVersionInfo($path)
            if ($version.ProductName -match '(?i)antigravity' -or $version.CompanyName -match '(?i)google') {
                [pscustomobject]@{
                    Path          = $item.FullName
                    Version       = $version.ProductVersion
                    ProductName   = $version.ProductName
                    LastWriteTime = $item.LastWriteTime
                }
            }
        } catch {
            # Ignore files that disappear or cannot expose version metadata.
        }
    }

    $selected = $valid |
        Sort-Object `
            @{ Expression = { if ([System.IO.Path]::GetFileName($_.Path) -ieq 'Antigravity.exe') { 0 } else { 1 } } }, `
            @{ Expression = { if ($_.Path -like '*\Programs\Antigravity\*') { 0 } else { 1 } } }, `
            @{ Expression = { $_.LastWriteTime }; Descending = $true } |
        Select-Object -First 1

    if (-not $selected) {
        throw '未找到 Antigravity。请先安装官方 Windows 版本。'
    }

    return $selected
}

function Add-ConfiguredProxies {
    param([System.Collections.Generic.List[object]]$List)

    foreach ($name in @('HTTPS_PROXY', 'HTTP_PROXY', 'ALL_PROXY', 'https_proxy', 'http_proxy', 'all_proxy')) {
        $variable = Get-Item -LiteralPath ("Env:{0}" -f $name) -ErrorAction SilentlyContinue
        if ($variable) {
            Add-ProxyCandidate -List $List -Value ([string]$variable.Value) -Source "环境变量 $name"
        }
    }

    $internetSettings = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings'
    if (Test-Path -LiteralPath $internetSettings) {
        try {
            $settings = Get-ItemProperty -LiteralPath $internetSettings
            if (-not [string]::IsNullOrWhiteSpace([string]$settings.ProxyServer)) {
                $source = if ([int]$settings.ProxyEnable -eq 1) { 'Windows 系统代理' } else { 'Windows 已保存代理' }
                Add-ProxyCandidate -List $List -Value ([string]$settings.ProxyServer) -Source $source
            }
        } catch {
            # Ignore unavailable Internet Settings.
        }
    }

    $proxyProcessPattern = '(?i)(clash|mihomo|sing-box|v2ray|xray|tun2socks|proxy|verge|warp)'
    $listenConnections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
        Where-Object { $_.LocalPort -gt 0 -and $_.LocalPort -lt 65536 }

    foreach ($connection in ($listenConnections | Sort-Object LocalPort, OwningProcess -Unique)) {
        try {
            $process = Get-Process -Id $connection.OwningProcess -ErrorAction Stop
            if ($process.ProcessName -match $proxyProcessPattern) {
                Add-ProxyCandidate `
                    -List $List `
                    -Value ("http://127.0.0.1:{0}" -f $connection.LocalPort) `
                    -Source ("本机代理进程 {0}" -f $process.ProcessName)
            }
        } catch {
            # Ignore system-owned or exited listeners.
        }
    }

    foreach ($port in @(7890, 7897, 7898, 7899, 10809, 8080, 1080)) {
        if ($listenConnections | Where-Object { $_.LocalPort -eq $port }) {
            Add-ProxyCandidate -List $List -Value ("http://127.0.0.1:{0}" -f $port) -Source '常见本机代理端口'
        }
    }
}

function Test-HttpProxy {
    param(
        [string]$Uri,
        [string]$ProbeUrl
    )

    try {
        $ProgressPreference = 'SilentlyContinue'
        $response = Invoke-WebRequest `
            -Uri $ProbeUrl `
            -Proxy $Uri `
            -TimeoutSec 6 `
            -UseBasicParsing `
            -ErrorAction Stop
        return ([int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 400)
    } catch {
        return $false
    }
}

try {
    $app = Resolve-AntigravityExecutable
    Write-Host ("已识别 Antigravity {0}: {1}" -f $app.Version, $app.Path) -ForegroundColor Cyan

    $running = @(
        Get-Process -Name 'Antigravity' -ErrorAction SilentlyContinue |
            Where-Object {
                try { $_.Path -eq $app.Path } catch { $false }
            }
    )

    if ($running.Count -gt 0) {
        Write-Warning 'Antigravity 已经在运行，未重复启动。'
        exit 0
    }

    Add-ConfiguredProxies -List $proxyCandidates
    $workingProxy = $null

    foreach ($candidate in $proxyCandidates) {
        Write-Host ("检测代理 {0}（{1}）..." -f (Get-ProxyLabel $candidate.Uri), $candidate.Source) -ForegroundColor DarkGray
        if (Test-HttpProxy -Uri $candidate.Uri -ProbeUrl $proxyProbeUrl) {
            $workingProxy = $candidate
            break
        }
    }

    if ($workingProxy) {
        $env:HTTP_PROXY = $workingProxy.Uri
        $env:HTTPS_PROXY = $workingProxy.Uri
        $env:ALL_PROXY = $workingProxy.Uri
        Write-Host ("已识别可用代理：{0}（{1}）" -f (Get-ProxyLabel $workingProxy.Uri), $workingProxy.Source) -ForegroundColor Green
    } else {
        foreach ($name in @('HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy')) {
            Remove-Item -LiteralPath ("Env:{0}" -f $name) -ErrorAction SilentlyContinue
        }
        Write-Warning '未检测到可用 HTTP 代理，将尝试使用系统直连/TUN。'
    }

    $existingNoProxy = @($env:NO_PROXY, $env:no_proxy) |
        Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
        ForEach-Object { $_ -split ',' } |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ }
    $noProxyValue = @($noProxyHosts + $existingNoProxy) | Select-Object -Unique
    $env:NO_PROXY = $noProxyValue -join ','
    $env:no_proxy = $env:NO_PROXY

    Start-Process `
        -FilePath $app.Path `
        -ArgumentList @('--no-proxy-server') `
        -WorkingDirectory (Split-Path -Parent $app.Path) | Out-Null

    Write-Host 'Antigravity 已启动。首次加载可能需要等待约 1 分钟。' -ForegroundColor Green
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
