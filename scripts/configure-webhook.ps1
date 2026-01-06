# Script PowerShell pour configurer le webhook de paiement
# Usage: .\scripts\configure-webhook.ps1

Write-Host "🔔 Configuration du Webhook - Paiement Mobile Money" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Demander l'environnement
$env_choice = Read-Host "Environnement? (1=Local, 2=Production)"

if ($env_choice -eq "1") {
    $baseUrl = "http://localhost:3000"
    Write-Host "📍 Environnement: LOCAL" -ForegroundColor Yellow
} else {
    $baseUrl = "https://ivoirshop.ci"
    Write-Host "📍 Environnement: PRODUCTION" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Appel de l'API de configuration..." -ForegroundColor Cyan

# Appeler l'endpoint de configuration
$url = "$baseUrl/api/payment/mobile-money/set-webhook"

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json"
    
    Write-Host ""
    Write-Host "✅ SUCCÈS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Webhook URL: $($response.webhookUrl)" -ForegroundColor White
    Write-Host "Merchant Reference: $($response.merchant_reference)" -ForegroundColor White
    Write-Host ""
    Write-Host "Réponse complète:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host ""
    Write-Host "❌ ERREUR!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Assurez-vous que:" -ForegroundColor Yellow
    Write-Host "  1. Le serveur Nuxt est démarré (npm run dev)" -ForegroundColor White
    Write-Host "  2. Les variables d'environnement sont configurées" -ForegroundColor White
    Write-Host "  3. L'API DjoNanko est accessible" -ForegroundColor White
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan

