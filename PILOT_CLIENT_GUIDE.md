# Pilot Client Connection Guide

## Overview
This guide provides instructions for pilot client applications to connect to and disconnect from the United States Aviation Administrator (USAA) Pilot Network API.

## API Endpoints

### Production API
**Base URL:** `https://pilotnet.unitedstatesaviation.us`

### Development/Testing API
**Base URL:** `https://usaa-pilot-tracker.sebpartof2.workers.dev`

## Required Pilot Information

When connecting to the network, pilots must provide the following information:
- **CID** - Pilot ID (numeric)
- **Callsign** - Aircraft callsign (e.g., "UAL123", "N123AB")
- **Departure Airport** - ICAO code (e.g., "KLAX", "KJFK")
- **Arrival Airport** - ICAO code (e.g., "KJFK", "EGLL")
- **Airline ID** - Airline identifier (e.g., "UAL", "AAL", "PRIV" for private)
- **Aircraft Type** - Aircraft type code (e.g., "B737", "A320", "C172")

## Connection Process

### 1. Connect to Network (Go Online)

**Endpoint:** `POST /pilots/online`

**Request Format:**
```http
POST https://pilotnet.unitedstatesaviation.us/pilots/online
Content-Type: application/json

{
  "cid": "1234567",
  "callsign": "UAL123",
  "departureAirport": "KLAX",
  "arrivalAirport": "KJFK",
  "airlineId": "UAL",
  "aircraftType": "B737"
}
```

**Example with curl:**
```bash
curl -X POST https://pilotnet.unitedstatesaviation.us/pilots/online \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "1234567",
    "callsign": "UAL123",
    "departureAirport": "KLAX",
    "arrivalAirport": "KJFK",
    "airlineId": "UAL",
    "aircraftType": "B737"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pilot set as online",
  "data": {
    "cid": "1234567",
    "callsign": "UAL123",
    "departureAirport": "KLAX",
    "arrivalAirport": "KJFK",
    "airlineId": "UAL",
    "aircraftType": "B737",
    "status": "online",
    "onlineTime": "2025-10-04T15:30:00.000Z",
    "lastUpdate": "2025-10-04T15:30:00.000Z",
    "firstSeen": "2025-10-04T15:30:00.000Z"
  },
  "timestamp": "2025-10-04T15:30:00.000Z"
}
```

### 2. Disconnect from Network (Go Offline)

**Endpoint:** `POST /pilots/offline`

**Request Format:**
```http
POST https://pilotnet.unitedstatesaviation.us/pilots/offline
Content-Type: application/json

{
  "cid": "1234567"
}
```

**Example with curl:**
```bash
curl -X POST https://pilotnet.unitedstatesaviation.us/pilots/offline \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "1234567"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pilot set as offline",
  "data": {
    "cid": "1234567",
    "callsign": "UAL123",
    "departureAirport": "KLAX",
    "arrivalAirport": "KJFK",
    "airlineId": "UAL",
    "aircraftType": "B737",
    "status": "offline",
    "onlineTime": "2025-10-04T15:30:00.000Z",
    "lastUpdate": "2025-10-04T15:45:00.000Z",
    "firstSeen": "2025-10-04T15:30:00.000Z",
    "offlineTime": "2025-10-04T15:45:00.000Z"
  },
  "timestamp": "2025-10-04T15:45:00.000Z"
}
```

## Client Implementation Examples

### JavaScript/Node.js Client

```javascript
class PilotNetworkClient {
  constructor(baseUrl = 'https://pilotnet.unitedstatesaviation.us') {
    this.baseUrl = baseUrl;
  }

  async connect(pilotData) {
    try {
      const response = await fetch(`${this.baseUrl}/pilots/online`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pilotData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Connected to USAA Pilot Network');
        console.log(`Callsign: ${result.data.callsign}`);
        console.log(`Route: ${result.data.departureAirport} → ${result.data.arrivalAirport}`);
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      throw error;
    }
  }

  async disconnect(cid) {
    try {
      const response = await fetch(`${this.baseUrl}/pilots/offline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cid })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Disconnected from USAA Pilot Network');
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Disconnection failed:', error.message);
      throw error;
    }
  }

  async getStatus(cid) {
    try {
      const response = await fetch(`${this.baseUrl}/pilots/${cid}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Status check failed:', error.message);
      throw error;
    }
  }
}

// Usage Example
const client = new PilotNetworkClient();

// Connect to network
await client.connect({
  cid: "1234567",
  callsign: "UAL123",
  departureAirport: "KLAX",
  arrivalAirport: "KJFK",
  airlineId: "UAL",
  aircraftType: "B737"
});

// Later, disconnect from network
await client.disconnect("1234567");
```

### Python Client

```python
import requests
import json

class PilotNetworkClient:
    def __init__(self, base_url='https://pilotnet.unitedstatesaviation.us'):
        self.base_url = base_url
    
    def connect(self, pilot_data):
        """Connect pilot to the network"""
        try:
            response = requests.post(
                f"{self.base_url}/pilots/online",
                json=pilot_data,
                headers={'Content-Type': 'application/json'}
            )
            
            result = response.json()
            
            if result.get('success'):
                print("✅ Connected to USAA Pilot Network")
                print(f"Callsign: {result['data']['callsign']}")
                print(f"Route: {result['data']['departureAirport']} → {result['data']['arrivalAirport']}")
                return result['data']
            else:
                raise Exception(result.get('error', 'Unknown error'))
                
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            raise e
    
    def disconnect(self, cid):
        """Disconnect pilot from the network"""
        try:
            response = requests.post(
                f"{self.base_url}/pilots/offline",
                json={'cid': cid},
                headers={'Content-Type': 'application/json'}
            )
            
            result = response.json()
            
            if result.get('success'):
                print("✅ Disconnected from USAA Pilot Network")
                return result['data']
            else:
                raise Exception(result.get('error', 'Unknown error'))
                
        except Exception as e:
            print(f"❌ Disconnection failed: {e}")
            raise e
    
    def get_status(self, cid):
        """Get pilot status"""
        try:
            response = requests.get(f"{self.base_url}/pilots/{cid}")
            result = response.json()
            
            if result.get('success'):
                return result['data']
            else:
                raise Exception(result.get('error', 'Unknown error'))
                
        except Exception as e:
            print(f"❌ Status check failed: {e}")
            raise e

# Usage Example
client = PilotNetworkClient()

# Connect to network
pilot_data = {
    "cid": "1234567",
    "callsign": "UAL123",
    "departureAirport": "KLAX",
    "arrivalAirport": "KJFK",
    "airlineId": "UAL",
    "aircraftType": "B737"
}

client.connect(pilot_data)

# Later, disconnect from network
client.disconnect("1234567")
```

### C# Client

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class PilotNetworkClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public PilotNetworkClient(string baseUrl = "https://pilotnet.unitedstatesaviation.us")
    {
        _httpClient = new HttpClient();
        _baseUrl = baseUrl;
    }

    public async Task<PilotData> ConnectAsync(PilotConnectionRequest request)
    {
        try
        {
            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync($"{_baseUrl}/pilots/online", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ApiResponse<PilotData>>(responseContent);

            if (result.Success)
            {
                Console.WriteLine("✅ Connected to USAA Pilot Network");
                Console.WriteLine($"Callsign: {result.Data.Callsign}");
                Console.WriteLine($"Route: {result.Data.DepartureAirport} → {result.Data.ArrivalAirport}");
                return result.Data;
            }
            else
            {
                throw new Exception(result.Error);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Connection failed: {ex.Message}");
            throw;
        }
    }

    public async Task<PilotData> DisconnectAsync(string cid)
    {
        try
        {
            var request = new { cid };
            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync($"{_baseUrl}/pilots/offline", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ApiResponse<PilotData>>(responseContent);

            if (result.Success)
            {
                Console.WriteLine("✅ Disconnected from USAA Pilot Network");
                return result.Data;
            }
            else
            {
                throw new Exception(result.Error);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Disconnection failed: {ex.Message}");
            throw;
        }
    }
}

// Data models
public class PilotConnectionRequest
{
    public string Cid { get; set; }
    public string Callsign { get; set; }
    public string DepartureAirport { get; set; }
    public string ArrivalAirport { get; set; }
    public string AirlineId { get; set; }
    public string AircraftType { get; set; }
}

public class PilotData
{
    public string Cid { get; set; }
    public string Callsign { get; set; }
    public string DepartureAirport { get; set; }
    public string ArrivalAirport { get; set; }
    public string AirlineId { get; set; }
    public string AircraftType { get; set; }
    public string Status { get; set; }
    public DateTime OnlineTime { get; set; }
    public DateTime LastUpdate { get; set; }
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T Data { get; set; }
    public string Error { get; set; }
    public string Message { get; set; }
}
```

## Error Handling

### Common Error Responses

**400 - Bad Request (Missing/Invalid Data):**
```json
{
  "success": false,
  "error": "Missing required fields: cid, callsign, departureAirport, arrivalAirport, airlineId, and aircraftType"
}
```

**409 - Conflict (Callsign in Use):**
```json
{
  "success": false,
  "error": "Callsign already in use by another pilot"
}
```

**404 - Not Found (Pilot Not Found):**
```json
{
  "success": false,
  "error": "Pilot not found"
}
```

### Validation Rules

1. **CID**: Must be numeric
2. **Callsign**: Minimum 2 characters, will be converted to uppercase
3. **Departure/Arrival Airport**: Minimum 3 characters (ICAO format recommended)
4. **Airline ID**: Minimum 2 characters
5. **Aircraft Type**: Minimum 2 characters, will be converted to uppercase

## Best Practices

### 1. Connection Management
- Always disconnect when closing your client application
- Implement automatic reconnection on network failures
- Handle callsign conflicts gracefully

### 2. Error Handling
- Always check the `success` field in API responses
- Implement retry logic for network timeouts
- Log errors for debugging purposes

### 3. Data Validation
- Validate all required fields before sending requests
- Use proper ICAO codes for airports when possible
- Ensure callsigns follow aviation standards

### 4. Rate Limiting
- Don't spam connection/disconnection requests
- Implement reasonable delays between status checks
- Cache pilot status locally when possible

## Testing

### Test with Development API
Use the development API for testing: `https://usaa-pilot-tracker.sebpartof2.workers.dev`

### Example Test Sequence
```bash
# 1. Connect
curl -X POST https://usaa-pilot-tracker.sebpartof2.workers.dev/pilots/online \
  -H "Content-Type: application/json" \
  -d '{"cid":"TEST123","callsign":"TEST1","departureAirport":"KLAX","arrivalAirport":"KJFK","airlineId":"TST","aircraftType":"B737"}'

# 2. Check status
curl https://usaa-pilot-tracker.sebpartof2.workers.dev/pilots/TEST123

# 3. Disconnect
curl -X POST https://usaa-pilot-tracker.sebpartof2.workers.dev/pilots/offline \
  -H "Content-Type: application/json" \
  -d '{"cid":"TEST123"}'
```

## Support

For technical support or questions about the USAA Pilot Network API, please contact the development team or refer to the main API documentation.