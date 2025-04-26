# setup.ps1 - One-click setup for LibreChat on Windows
# Run this script from the project root in PowerShell

Write-Host "Copying environment configuration files..."
Copy-Item -Path .\librechat.example.yaml -Destination .\librechat.yaml -Force -ErrorAction SilentlyContinue
Copy-Item -Path .\camera-calibration-beta-6304d1bafd3c.json -Destination .\camera-calibration.json -Force -ErrorAction SilentlyContinue

Write-Host "Installing npm dependencies..."
npm install

Write-Host "Starting development server..."
npm run dev
