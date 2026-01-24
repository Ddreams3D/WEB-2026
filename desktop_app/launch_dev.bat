@echo off
REM Script de Lanzamiento para Desarrollo (Iteración Rápida)
REM Permite ejecutar DDreams sin compilar a .exe
REM Configura Bambu Studio para usar este archivo .bat

setlocal
set "SCRIPT_DIR=%~dp0"
set "PYTHONPATH=%SCRIPT_DIR%;%PYTHONPATH%"

echo [DEV] Launching DDreams from source...
echo [DEV] Script Dir: %SCRIPT_DIR%

REM Ejecutar el script principal pasando todos los argumentos y registrar salida
echo [DEV] Running: python "%SCRIPT_DIR%main.py" %* >> "%~dp0launch_debug.log"
python -u "%SCRIPT_DIR%main.py" %* >> "%~dp0launch_debug.log" 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python script failed with error level %ERRORLEVEL% >> "%~dp0launch_debug.log"
)

endlocal
