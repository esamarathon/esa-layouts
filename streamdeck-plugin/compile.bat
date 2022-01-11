@echo off
if not exist Release\ mkdir Release
del Release\com.esamarathon.streamdeck.streamDeckPlugin >nul 2>&1
DistributionTool.exe -b -i com.esamarathon.streamdeck.sdPlugin -o Release
pause
