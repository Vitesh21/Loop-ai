@echo off
echo Checking environment...
echo.
echo Node.js Version:
node -v
echo.
echo npm Version:
npm -v
echo.
echo Current Directory:
cd
echo.
echo Running a simple test...
echo console.log('Test successful!') > test.js
node test.js
del test.js
