@echo off
echo.
echo ================================
echo Compiling Eureka Server...
echo ================================
cd eureka-server
call mvn clean install -DskipTests
if errorlevel 1 (
    echo ERROR: Eureka Server compilation failed
    pause
    exit /b 1
)
cd ..

echo.
echo ================================
echo Compiling Usuario Service...
echo ================================
cd usuario
call mvn clean install -DskipTests
if errorlevel 1 (
    echo ERROR: Usuario Service compilation failed
    pause
    exit /b 1
)
cd ..

echo.
echo ================================
echo Compiling Pedidos Service...
echo ================================
cd pedidos
call mvn clean install -DskipTests
if errorlevel 1 (
    echo ERROR: Pedidos Service compilation failed
    pause
    exit /b 1
)
cd ..

echo.
echo ================================
echo Compiling Inventory Service...
echo ================================
cd inventory
call mvn clean install -DskipTests
if errorlevel 1 (
    echo ERROR: Inventory Service compilation failed
    pause
    exit /b 1
)
cd ..

echo.
echo ================================
echo All services compiled successfully!
echo ================================
echo.
pause
