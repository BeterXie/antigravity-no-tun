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
    Call MsgBox("Missing Start-Antigravity.ps1. Keep both files in the same folder.", 16, "Antigravity NO TUN")
    WScript.Quit 1
End If

If Not fileSystem.FileExists(powershellPath) Then
    Call MsgBox("Windows PowerShell 5.1 was not found.", 16, "Antigravity NO TUN")
    WScript.Quit 1
End If

command = Chr(34) & powershellPath & Chr(34) & " -NoLogo -NoProfile -ExecutionPolicy Bypass -File " & Chr(34) & launcherPath & Chr(34)
exitCode = shell.Run(command, 1, True)

If exitCode <> 0 Then
    Call MsgBox("The launcher returned error code " & exitCode & ". Run Start-Antigravity.ps1 directly for details.", 16, "Antigravity NO TUN")
End If
