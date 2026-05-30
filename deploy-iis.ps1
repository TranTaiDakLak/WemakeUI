param(
  [string]$SiteName = "ui.wemake.vn",
  [string]$HostName = "ui.wemake.vn",
  [string]$PhysicalPath = "C:\\inetpub\\wwwroot\\ui.wemake.vn\\frontend\\dist",
  [string]$AppPoolName = "ui.wemake.vn",
  [int]$HttpPort = 80,
  [int]$HttpsPort = 443,
  [string]$CertThumbprint = ""
)

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
  [Security.Principal.WindowsBuiltInRole]::Administrator
)
if (-not $isAdmin) {
  throw "Please run PowerShell as Administrator."
}

Import-Module WebAdministration -ErrorAction Stop

if (-not (Test-Path -LiteralPath $PhysicalPath)) {
  throw "PhysicalPath not found: $PhysicalPath"
}

if (-not (Test-Path "IIS:\\AppPools\\$AppPoolName")) {
  New-WebAppPool -Name $AppPoolName | Out-Null
}
Set-ItemProperty "IIS:\\AppPools\\$AppPoolName" -Name managedRuntimeVersion -Value ""
Set-ItemProperty "IIS:\\AppPools\\$AppPoolName" -Name processModel.identityType -Value "ApplicationPoolIdentity"

if (-not (Get-Website -Name $SiteName -ErrorAction SilentlyContinue)) {
  New-Website -Name $SiteName -PhysicalPath $PhysicalPath -ApplicationPool $AppPoolName -Port $HttpPort -HostHeader $HostName | Out-Null
} else {
  Set-ItemProperty "IIS:\\Sites\\$SiteName" -Name physicalPath -Value $PhysicalPath
  Set-ItemProperty "IIS:\\Sites\\$SiteName" -Name applicationPool -Value $AppPoolName
}

# Ensure HTTP binding exists
$httpBindingInfo = "*:$HttpPort:$HostName"
if (-not (Get-WebBinding -Name $SiteName -Protocol "http" -ErrorAction SilentlyContinue | Where-Object { $_.bindingInformation -eq $httpBindingInfo })) {
  New-WebBinding -Name $SiteName -Protocol "http" -Port $HttpPort -HostHeader $HostName | Out-Null
}

# Optional HTTPS binding (requires a cert thumbprint from LocalMachine\\My)
if ($CertThumbprint -ne "") {
  $httpsBindingInfo = "*:$HttpsPort:$HostName"
  if (-not (Get-WebBinding -Name $SiteName -Protocol "https" -ErrorAction SilentlyContinue | Where-Object { $_.bindingInformation -eq $httpsBindingInfo })) {
    New-WebBinding -Name $SiteName -Protocol "https" -Port $HttpsPort -HostHeader $HostName -SslFlags 1 | Out-Null
  }

  $certPath = "Cert:\\LocalMachine\\My\\$CertThumbprint"
  if (-not (Test-Path $certPath)) {
    throw "Certificate not found at $certPath"
  }

  # Bind cert to SNI host+port
  $sslBindingPath = "IIS:\\SslBindings\\$HttpsPort!$HostName"
  if (Test-Path $sslBindingPath) {
    Remove-Item $sslBindingPath -Force
  }
  New-Item $sslBindingPath -Thumbprint $CertThumbprint -SSLFlags 1 | Out-Null
}

Start-Website -Name $SiteName | Out-Null

Write-Host "OK: IIS site '$SiteName' -> $PhysicalPath"
Write-Host "HTTP:  http://$HostName`:$HttpPort/"
if ($CertThumbprint -ne "") {
  Write-Host "HTTPS: https://$HostName`:$HttpsPort/"
}

