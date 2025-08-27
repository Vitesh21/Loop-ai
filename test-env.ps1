Write-Host "=== Environment Check ==="
Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)"
Write-Host "Current Directory: $(Get-Location)"
Write-Host "Node.js Version: $(node --version)"
Write-Host "npm Version: $(npm --version)"

# Test file operations
$testContent = "console.log('Test successful!');"
$testFilePath = "./test-ps.js"

Write-Host "`nCreating test file..."
$testContent | Out-File -FilePath $testFilePath -Encoding utf8

Write-Host "Test file content:"
Get-Content $testFilePath

Write-Host "`nRunning test file:"
node $testFilePath

Write-Host "`nCleaning up..."
Remove-Item $testFilePath -ErrorAction SilentlyContinue

Write-Host "`nEnvironment check complete."
