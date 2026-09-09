@echo off
rem Entry point for editing past-exam figures. Double-click to run.
rem The real work is in frontend/scripts/start-figure-editor.mjs.
rem
rem KEEP THIS FILE PURE ASCII. cmd.exe reads a .bat/.cmd in the console's
rem current code page, so Japanese text inside the file is mis-parsed and the
rem whole script dies with a syntax error (measured). All Japanese messages
rem come from the Node script, which runs after chcp 65001 below.
chcp 65001 >nul
title Fix past-exam figures

where node >nul 2>nul
if errorlevel 1 goto :no_node

cd /d "%~dp0frontend"
node scripts/start-figure-editor.mjs
goto :done

:no_node
echo.
echo ============================================================
echo   Node.js is not installed / Node.js が入っていません
echo.
echo   Opening https://nodejs.org/ja - install the LTS version,
echo   restart the PC, then open this file again.
echo ============================================================
echo.
start "" https://nodejs.org/ja
pause
exit /b 1

:done
echo.
pause
