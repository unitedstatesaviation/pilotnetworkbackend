# USAA Pilot Network API Documentation

## Overview

The United States Aviation Administrator (USAA) Pilot Network API is a RESTful service designed to track and manage aviation pilot data for comprehensive flight network monitoring. The API handles pilot online/offline status, flight information, and provides real-time network visibility.

## Base URLs

| Environment | URL |
|-------------|-----|
| **Production** | `https://pilotnet.unitedstatesaviation.us` |
| **Development** | `https://usaa-pilot-tracker.sebpartof2.workers.dev` |

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Data Format

- **Request Format**: JSON
- **Response Format**: JSON
- **Character Encoding**: UTF-8
- **Date Format**: ISO 8601 (e.g., `2025-10-04T15:30:00.000Z`)

## CORS Support

The API includes CORS headers to allow cross-origin requests:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Rate Limiting

Currently, no rate limiting is implemented. Use the API responsibly.

---

## API Endpoints

### 1. API Information

Get basic information about the API and available endpoints.

**Endpoint:** `GET /`

**Response:**
```json
{
  "name": "United States Aviation Administrator (USAA) API",
  "version": "1.0.0",
  "description": "API for tracking aviation pilots and flight status",
  "endpoints": {
    "GET /": "API information",
    "GET /pilots": "List all online pilots",
    "GET /pilots/:cid": "Get specific pilot by CID",
    "GET /callsign/:callsign": "Get pilot by callsign",
    "POST /pilots/online": "Set pilot as online",
    "POST /pilots/offline": "Set pilot as offline",
    "DELETE /pilots/:cid": "Remove pilot from tracking"
  }
}
```

**Example:**
```bash
curl https://pilotnet.unitedstatesaviation.us/
```

---

### 2. List All Online Pilots

Retrieve a list of all currently online pilots, sorted by most recent online time.

**Endpoint:** `GET /pilots`

**Response:**
```json
{
  "success": true,
  "data": [
    {
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
    }
  ],
  "count": 1,
  "timestamp": "2025-10-04T15:35:00.000Z"
}
```

**Example:**
```bash
curl https://pilotnet.unitedstatesaviation.us/pilots
```

**Response Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### 3. Get Pilot by CID

Retrieve information about a specific pilot using their CID (Pilot ID).

**Endpoint:** `GET /pilots/{cid}`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `cid` | string | Pilot ID (numeric) |

**Response:**
```json
{
  "success": true,
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
  "timestamp": "2025-10-04T15:35:00.000Z"
}
```

**Example:**
```bash
curl https://pilotnet.unitedstatesaviation.us/pilots/1234567
```

**Response Codes:**
- `200 OK` - Pilot found
- `400 Bad Request` - Invalid CID format
- `404 Not Found` - Pilot not found
- `500 Internal Server Error` - Server error

**Error Example:**
```json
{
  "success": false,
  "error": "Invalid CID format. CID must be numeric."
}
```

---

### 4. Get Pilot by Callsign

Retrieve pilot information using their callsign.

**Endpoint:** `GET /callsign/{callsign}`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `callsign` | string | Aircraft callsign (case-insensitive) |

**Response:**
```json
{
  "success": true,
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
  "timestamp": "2025-10-04T15:35:00.000Z"
}
```

**Example:**
```bash
curl https://pilotnet.unitedstatesaviation.us/callsign/UAL123
```

**Response Codes:**
- `200 OK` - Callsign found
- `400 Bad Request` - Invalid callsign format
- `404 Not Found` - Callsign not found
- `500 Internal Server Error` - Server error

---

### 5. Set Pilot Online

Connect a pilot to the network by setting them as online.

**Endpoint:** `POST /pilots/online`

**Request Body:**
```json
{
  "cid": "1234567",
  "callsign": "UAL123",
  "departureAirport": "KLAX",
  "arrivalAirport": "KJFK",
  "airlineId": "UAL",
  "aircraftType": "B737"
}
```

**Request Parameters:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `cid` | string | Yes | Pilot ID | Must be numeric |
| `callsign` | string | Yes | Aircraft callsign | Min 2 characters, converted to uppercase |
| `departureAirport` | string | Yes | Departure airport ICAO code | Min 3 characters, converted to uppercase |
| `arrivalAirport` | string | Yes | Arrival airport ICAO code | Min 3 characters, converted to uppercase |
| `airlineId` | string | Yes | Airline identifier | Min 2 characters |
| `aircraftType` | string | Yes | Aircraft type code | Min 2 characters, converted to uppercase |

**Response:**
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

**Example:**
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

**Response Codes:**
- `200 OK` - Pilot successfully set online
- `400 Bad Request` - Invalid or missing required fields
- `409 Conflict` - Callsign already in use by another pilot
- `500 Internal Server Error` - Server error

**Error Examples:**
```json
{
  "success": false,
  "error": "Missing required fields: cid, callsign, departureAirport, arrivalAirport, airlineId, and aircraftType"
}
```

```json
{
  "success": false,
  "error": "Callsign already in use by another pilot"
}
```

---

### 6. Set Pilot Offline

Disconnect a pilot from the network by setting them as offline.

**Endpoint:** `POST /pilots/offline`

**Request Body:**
```json
{
  "cid": "1234567"
}
```

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cid` | string | Yes | Pilot ID (must be numeric) |

**Response:**
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

**Example:**
```bash
curl -X POST https://pilotnet.unitedstatesaviation.us/pilots/offline \
  -H "Content-Type: application/json" \
  -d '{"cid": "1234567"}'
```

**Response Codes:**
- `200 OK` - Pilot successfully set offline
- `400 Bad Request` - Invalid or missing CID
- `404 Not Found` - Pilot not found
- `500 Internal Server Error` - Server error

---

### 7. Remove Pilot from Tracking

Completely remove a pilot from the tracking system.

**Endpoint:** `DELETE /pilots/{cid}`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `cid` | string | Pilot ID (numeric) |

**Response:**
```json
{
  "success": true,
  "message": "Pilot removed from tracking",
  "timestamp": "2025-10-04T15:50:00.000Z"
}
```

**Example:**
```bash
curl -X DELETE https://pilotnet.unitedstatesaviation.us/pilots/1234567
```

**Response Codes:**
- `200 OK` - Pilot successfully removed
- `400 Bad Request` - Invalid CID format
- `404 Not Found` - Pilot not found
- `500 Internal Server Error` - Server error

---

## Data Models

### Pilot Object

```typescript
interface Pilot {
  cid: string;                    // Pilot ID (numeric string)
  callsign: string;              // Aircraft callsign (uppercase)
  departureAirport: string;      // ICAO departure airport code (uppercase)
  arrivalAirport: string;        // ICAO arrival airport code (uppercase)
  airlineId: string;             // Airline identifier
  aircraftType: string;          // Aircraft type code (uppercase)
  status: "online" | "offline";  // Current status
  onlineTime: string;            // ISO timestamp when pilot came online
  lastUpdate: string;            // ISO timestamp of last update
  firstSeen: string;             // ISO timestamp when pilot was first tracked
  offlineTime?: string;          // ISO timestamp when pilot went offline (optional)
}
```

### API Response

```typescript
interface ApiResponse<T> {
  success: boolean;              // Indicates if the request was successful
  data?: T;                      // Response data (present on success)
  error?: string;                // Error message (present on failure)
  message?: string;              // Success message (present on some success responses)
  timestamp: string;             // ISO timestamp of the response
  count?: number;                // Number of items (for list responses)
}
```

---

## Error Handling

### Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error details (in development)"
}
```

### HTTP Status Codes

| Code | Description | When it occurs |
|------|-------------|----------------|
| `200` | OK | Request successful |
| `400` | Bad Request | Invalid input data or parameters |
| `404` | Not Found | Resource not found (pilot, callsign) |
| `409` | Conflict | Callsign already in use |
| `500` | Internal Server Error | Server-side error |

### Common Validation Errors

#### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required fields: cid, callsign, departureAirport, arrivalAirport, airlineId, and aircraftType"
}
```

#### Invalid CID Format
```json
{
  "success": false,
  "error": "Invalid CID format. CID must be numeric."
}
```

#### Invalid Callsign Format
```json
{
  "success": false,
  "error": "Invalid callsign format"
}
```

#### Invalid Airport Format
```json
{
  "success": false,
  "error": "Invalid departure airport format. Must be at least 3 characters."
}
```

#### Callsign Conflict
```json
{
  "success": false,
  "error": "Callsign already in use by another pilot"
}
```

---

## Examples

### Complete Pilot Session Example

#### 1. Connect Pilot
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

#### 2. Check Status
```bash
curl https://pilotnet.unitedstatesaviation.us/pilots/1234567
```

#### 3. List All Pilots
```bash
curl https://pilotnet.unitedstatesaviation.us/pilots
```

#### 4. Find by Callsign
```bash
curl https://pilotnet.unitedstatesaviation.us/callsign/UAL123
```

#### 5. Disconnect Pilot
```bash
curl -X POST https://pilotnet.unitedstatesaviation.us/pilots/offline \
  -H "Content-Type: application/json" \
  -d '{"cid": "1234567"}'
```

### Batch Operations Example

Multiple pilots connecting:
```bash
# Pilot 1
curl -X POST https://pilotnet.unitedstatesaviation.us/pilots/online \
  -H "Content-Type: application/json" \
  -d '{"cid":"1234567","callsign":"UAL123","departureAirport":"KLAX","arrivalAirport":"KJFK","airlineId":"UAL","aircraftType":"B737"}'

# Pilot 2
curl -X POST https://pilotnet.unitedstatesaviation.us/pilots/online \
  -H "Content-Type: application/json" \
  -d '{"cid":"2345678","callsign":"AAL456","departureAirport":"KJFK","arrivalAirport":"KORD","airlineId":"AAL","aircraftType":"A320"}'

# Check all online pilots
curl https://pilotnet.unitedstatesaviation.us/pilots
```

---

## SDK Examples

### JavaScript/Node.js

```javascript
class USAAPilotAPI {
  constructor(baseUrl = 'https://pilotnet.unitedstatesaviation.us') {
    this.baseUrl = baseUrl;
  }

  async connect(pilotData) {
    const response = await fetch(`${this.baseUrl}/pilots/online`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pilotData)
    });
    return await response.json();
  }

  async disconnect(cid) {
    const response = await fetch(`${this.baseUrl}/pilots/offline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid })
    });
    return await response.json();
  }

  async getPilot(cid) {
    const response = await fetch(`${this.baseUrl}/pilots/${cid}`);
    return await response.json();
  }

  async getAllPilots() {
    const response = await fetch(`${this.baseUrl}/pilots`);
    return await response.json();
  }
}
```

### Python

```python
import requests

class USAAPilotAPI:
    def __init__(self, base_url='https://pilotnet.unitedstatesaviation.us'):
        self.base_url = base_url
    
    def connect(self, pilot_data):
        response = requests.post(f"{self.base_url}/pilots/online", json=pilot_data)
        return response.json()
    
    def disconnect(self, cid):
        response = requests.post(f"{self.base_url}/pilots/offline", json={'cid': cid})
        return response.json()
    
    def get_pilot(self, cid):
        response = requests.get(f"{self.base_url}/pilots/{cid}")
        return response.json()
    
    def get_all_pilots(self):
        response = requests.get(f"{self.base_url}/pilots")
        return response.json()
```

---

## Data Storage

### KV Namespace: `USAA_PILOTS`

The API uses Cloudflare KV storage with the following key patterns:

#### Key Patterns
- `pilot:{cid}` - Stores complete pilot data objects
- `callsign:{CALLSIGN}` - Maps callsigns to CIDs for fast lookup

#### Storage Examples
```
pilot:1234567 → {pilot object}
callsign:UAL123 → "1234567"
```

### Data Lifecycle
1. **Connect**: Creates `pilot:{cid}` and `callsign:{callsign}` entries
2. **Update**: Modifies `pilot:{cid}` entry, may update callsign mapping
3. **Disconnect**: Updates `pilot:{cid}` status, removes callsign mapping
4. **Delete**: Removes both `pilot:{cid}` and `callsign:{callsign}` entries

---

## Security Considerations

### Current Security Model
- No authentication required
- CORS enabled for all origins
- No rate limiting implemented

### Recommendations for Production
1. **API Authentication**: Implement API keys or JWT tokens
2. **Rate Limiting**: Add rate limiting per IP/client
3. **Input Validation**: Enhanced validation and sanitization
4. **CORS Restriction**: Limit CORS to specific domains
5. **Logging**: Implement comprehensive request logging
6. **Monitoring**: Add health checks and monitoring

---

## Performance

### Response Times
- Typical response time: < 100ms
- KV read operations: < 50ms
- KV write operations: < 100ms

### Limitations
- KV eventual consistency (writes may take up to 60 seconds to propagate globally)
- No built-in pagination (consider for large pilot lists)
- Cloudflare Workers CPU time limit: 50ms per request

### Optimization Tips
1. Use batch operations when possible
2. Cache pilot data locally in client applications
3. Implement client-side deduplication for rapid requests
4. Use WebSockets for real-time updates (future enhancement)

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Basic pilot CRUD operations
- Online/offline status tracking
- Callsign uniqueness enforcement
- Full CORS support

### Planned Features
- WebSocket support for real-time updates
- API authentication
- Rate limiting
- Enhanced search and filtering
- Pilot statistics and analytics
- Flight plan integration

---

## Support

### Documentation
- [Pilot Client Guide](PILOT_CLIENT_GUIDE.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [Production Deployment](PRODUCTION_DEPLOYMENT.md)
- [Usage Examples](examples/usage.md)

### Technical Support
For technical support, bug reports, or feature requests, please contact the development team or create an issue in the project repository.

### API Status
Check the API status at: `GET /` endpoint for basic health check.