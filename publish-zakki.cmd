@echo off
cd /d C:\Users\user\Documents\Projects\zakki-site

echo ========================================
echo zakki publish start
echo ========================================
echo.

call npm.cmd run publish

echo.
echo ========================================
echo finished
echo ========================================
echo.

if errorlevel 1 (
  echo Publish failed.
) else (
  echo Publish finished successfully.
)

echo.
pause