@echo off
rem 過去問の図版を直すための入口。ダブルクリックで開く。
rem 中身は frontend/scripts/start-figure-editor.mjs。
chcp 65001 >nul
title 過去問の図版を直す

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo ============================================================
  echo   Node.js が入っていません
  echo.
  echo   https://nodejs.org/ja から LTS 版を入れて、
  echo   パソコンを再起動してから、もう一度このファイルを開いて
  echo   ください。
  echo ============================================================
  echo.
  pause
  exit /b 1
)

cd /d "%~dp0frontend"
node scripts/start-figure-editor.mjs

echo.
echo 終わりました。この画面は閉じてかまいません。
pause
