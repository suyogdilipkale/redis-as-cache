@echo off
setlocal enableextensions enabledelayedexpansion
set /a "x = 0"
cd "C:\Users\Suyog Kale\eshopping\"
:more_to_process
    if %x% leq 10 (
        start /min cmd /C "node index.js"
        set /a "x = x + 1"
        goto :more_to_process
    )
    endlocal
exit