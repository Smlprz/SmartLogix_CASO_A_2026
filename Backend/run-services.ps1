# PowerShell script to run all SmartLogix services in parallel

Write-Host ""
Write-Host "================================"
Write-Host "Starting SmartLogix Services"
Write-Host "================================"
Write-Host ""
Write-Host "This script will launch 4 services in separate windows"
Write-Host ""

# Function to start a service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [string]$JarFile,
        [int]$Port
    )

    Write-Host "Starting $ServiceName (Port $Port)..."
    $scriptBlock = {
        Set-Location $ServicePath
        & java -jar $JarFile
    }

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; & java -jar '$JarFile'" -WindowStyle Normal
}

$backendPath = Get-Location

# Start Eureka Server
Start-Service -ServiceName "Eureka Server" -ServicePath "$backendPath\eureka-server" -JarFile "target\eureka-server-1.0.0.jar" -Port 8761
Start-Sleep -Seconds 3

# Start Usuario Service
Start-Service -ServiceName "Usuario Service" -ServicePath "$backendPath\usuario" -JarFile "target\usuario-1.0.0.jar" -Port 8080
Start-Sleep -Seconds 2

# Start Pedidos Service
Start-Service -ServiceName "Pedidos Service" -ServicePath "$backendPath\pedidos" -JarFile "target\pedidos-1.0.0.jar" -Port 8081
Start-Sleep -Seconds 2

# Start Inventory Service
Start-Service -ServiceName "Inventory Service" -ServicePath "$backendPath\inventory" -JarFile "target\inventory-0.0.1-SNAPSHOT.jar" -Port 8083

Write-Host ""
Write-Host "================================"
Write-Host "Services started!"
Write-Host "================================"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Wait 10-15 seconds for all services to fully start"
Write-Host "2. Open browser: http://localhost:8761/"
Write-Host "3. Check 'Instances currently registered with Eureka'"
Write-Host "4. You should see:"
Write-Host "   - usuario-service (8080)"
Write-Host "   - pedidos-service (8081)"
Write-Host "   - inventory-service (8083)"
Write-Host ""
