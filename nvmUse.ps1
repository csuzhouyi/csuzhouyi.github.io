$nvmHome = $env:NVM_HOME

$nvmrcPath = "$PWD\.nvmrc"
$targetVersion = Get-Content $nvmrcPath -Raw
if ($nvmHome) {
    $nodePath = Join-Path -Path $nvmHome -ChildPath "v$targetVersion"
    $env:PATH = "$nodePath;$env:PATH"
    Write-Host "Path updated: $nodePath added to PATH"
} else {
    Write-Host "NVM_HOME not set!"
}
Write-Host "node version: $(node -v)"
