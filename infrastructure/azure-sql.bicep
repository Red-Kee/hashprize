@description('Location for all resources')
param location string = resourceGroup().location

@description('The name of the SQL logical server')
param serverName string = 'hashprize-sql-server'

@description('The name of the SQL database')
param databaseName string = 'hashprize-db'

@description('The administrator username of the SQL logical server')
param administratorLogin string

@description('The administrator password of the SQL logical server')
@secure()
param administratorLoginPassword string

@description('The name of the App Service for connection')
param appServiceName string = 'hashprizeTestnet'

resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: serverName
  location: location
  properties: {
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: databaseName
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
    capacity: 5
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648 // 2GB
  }
}

// Allow Azure services to access the server
resource allowAzureServices 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAllWindowsAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Allow your local IP for development (replace with your actual IP)
resource allowDeveloperIP 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  parent: sqlServer
  name: 'AllowDeveloperIP'
  properties: {
    startIpAddress: '0.0.0.0' // Replace with your actual IP
    endIpAddress: '255.255.255.255' // Replace with your actual IP
  }
}

output serverName string = sqlServer.name
output databaseName string = sqlDatabase.name
output connectionString string = 'Server=${sqlServer.properties.fullyQualifiedDomainName};Database=${databaseName};User Id=${administratorLogin};Password=${administratorLoginPassword};Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;'
