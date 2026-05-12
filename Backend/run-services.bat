@echo off
echo.
echo ================================
echo Starting SmartLogix Services
echo ================================
echo.
echo IMPORTANT: This script will open 4 new command windows
echo Keep all windows open to run the services
echo.
echo Opening Terminal 1: Eureka Server (Port 8761)...
start "Eureka Server" cmd /k "cd eureka-server && java -jar target/eureka-server-1.0.0.jar"

timeout /t 3 /nobreak

echo Opening Terminal 2: Usuario Service (Port 8080)...
start "Usuario Service" cmd /k "cd usuario && java -jar target/usuario-1.0.0.jar"

timeout /t 2 /nobreak

echo Opening Terminal 3: Pedidos Service (Port 8081)...
start "Pedidos Service" cmd /k "cd pedidos && java -jar target/pedidos-1.0.0.jar"

timeout /t 2 /nobreak

echo Opening Terminal 4: Inventory Service (Port 8083)...
start "Inventory Service" cmd /k "cd inventory && java -jar target/inventory-0.0.1-SNAPSHOT.jar"

echo.
echo ================================
echo All services started!
echo ================================
echo.
echo Next steps:
echo 1. Wait 10-15 seconds for all services to fully start
echo 2. Open browser: http://localhost:8761/
echo 3. Check "Instances currently registered with Eureka"
echo 4. You should see:
echo    - usuario-service (8080)
echo    - pedidos-service (8081)
echo    - inventory-service (8083)
echo.
pause
