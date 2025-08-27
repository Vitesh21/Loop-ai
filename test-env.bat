@echo off
echo Testing environment...
echo.
echo Node.js version:
node -v
echo.
echo Current directory:
cd
echo.
echo Creating test file...
echo console.log("Test successful!") > test.js
echo.
echo Running test file:
node test.js
echo.
echo Cleaning up...
del test.js
echo.
echo Test complete.
