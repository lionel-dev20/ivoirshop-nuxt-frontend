# Script PowerShell pour tester le webhook localement
# Usage: .\scripts\test-webhook.ps1

Write-Host "🧪 Test du Webhook - Paiement Mobile Money" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$webhookUrl = "$baseUrl/api/payment/mobile-money/callback"

Write-Host "📍 URL du webhook: $webhookUrl" -ForegroundColor Yellow
Write-Host ""

# Données de test
$testData = @{
    transaction_id = "TEST-$(Get-Date -Format 'yyyyMMddHHmmss')"
    status = "success"
    amount = 50000
    createdAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    updatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    metadata = @{
        order_id = "12345FGGVD"
        email = "customer@email.com"
        phoneNumber = "+2250709483463"
    }
} | ConvertTo-Json

Write-Host "📤 Envoi de la notification test..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Données envoyées:" -ForegroundColor White
Write-Host $testData -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $testData -ContentType "application/json"
    
    Write-Host "✅ SUCCÈS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Réponse du webhook:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "❌ ERREUR!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Assurez-vous que le serveur Nuxt est démarré (npm run dev)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan

