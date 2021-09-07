@echo off

cd src
node build.js || pause
cd ..
web-ext build --ignore-files src/**/* build.bat --overwrite-dest || pause