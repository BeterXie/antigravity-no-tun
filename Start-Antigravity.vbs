Option Explicit

Dim shell
Dim fileSystem
Dim scriptDirectory
Dim powershellPath
Dim launcherPath
Dim command
Dim exitCode

Set shell = CreateObject("WScript.Shell")
Set fileSystem = CreateObject("Scripting.FileSystemObject")

scriptDirectory = fileSystem.GetParentFolderName(WScript.ScriptFullName)
launcherPath = fileSystem.BuildPath(scriptDirectory, "Start-Antigravity.ps1")
powershellPath = shell.ExpandEnvironmentStrings("%WINDIR%") & "\System32\WindowsPowerShell\v1.0\powershell.exe"

If Not fileSystem.FileExists(launcherPath) Then
    MsgBox "找不到 Start-Antigravity.ps1。请把两个文件放在同一个文件夹中。", 16, "Antigravity NO TUN"
    WScript.Quit 1
End If

If Not fileSystem.FileExists(powershellPath) Then
    MsgBox "找不到 Windows PowerShell 5.1。请确认系统组件没有被移除。", 16, "Antigravity NO TUN"
    WScript.Quit 1
End If

command = Chr(34) & powershellPath & Chr(34) & " -NoLogo -NoProfile -ExecutionPolicy Bypass -File " & Chr(34) & launcherPath & Chr(34)
exitCode = shell.Run(command, 1, True)

If exitCode <> 0 Then
    MsgBox "启动器返回错误代码 " & exitCode & "。请直接运行 Start-Antigravity.ps1 查看详细信息。", 16, "Antigravity NO TUN"
End If
