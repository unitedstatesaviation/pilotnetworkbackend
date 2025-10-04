# United States Aviation Administrator (USAA) Backend API

A Cloudflare Workers-based backend API for the United States Aviation Administrator (USAA) system. This API tracks and manages aviation pilot data including departure airport, arrival airport, CID, callsign, airline ID, and aircraft type for comprehensive flight network monitoring.

## Features

- Track aviation pilot online/offline status
- Store pilot flight information with departure/arrival airports
- Track airline ID and aircraft type for each flight
- Map callsigns to pilot CIDs for USAA network
- RESTful API with JSON responses
- CORS support for web applications
- Deployable to Cloudflare Workers or Pages
- Uses Cloudflare KV for data persistence
- Designed for United States Aviation Administrator operations

## API Endpoints

### GET /
Returns API information and available endpoints.

### GET /pilots
Returns a list of all currently online pilots, sorted by most recent online time.

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
      "onlineTime": "2024-01-01T12:00:00.000Z",
      "lastUpdate": "2024-01-01T12:00:00.000Z",
      "firstSeen": "2024-01-01T10:00:00.000Z"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /pilots/:cid
Returns information about a specific pilot by their CID.

**Parameters:**
- `cid` - Pilot ID (numeric)

### GET /callsign/:callsign
Returns pilot information by their callsign.

**Parameters:**
- `callsign` - Pilot callsign (case-insensitive)

### POST /pilots/online
Sets a pilot as online.

**Body:**
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
    "onlineTime": "2024-01-01T12:00:00.000Z",
    "lastUpdate": "2024-01-01T12:00:00.000Z",
    "firstSeen": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### POST /pilots/offline
Sets a pilot as offline.

**Body:**
```json
{
  "cid": "1234567"
}
```

### DELETE /pilots/:cid
Removes a pilot from tracking completely.

**Parameters:**
- `cid` - Pilot ID (numeric)

## Setup and Deployment

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure Cloudflare KV namespace:
```bash
# Create KV namespace
wrangler kv:namespace create "USAA_PILOTS"
wrangler kv:namespace create "USAA_PILOTS" --preview

# Update wrangler.toml with the namespace IDs returned from above commands
```

3. Update `wrangler.toml` with your KV namespace IDs.

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

**Live API URL:** https://usaa-pilot-tracker.sebpartof2.workers.dev

**Production URL:** https://pilotnet.unitedstatesaviation.us

## Documentation

- 📘 **[Pilot Client Guide](PILOT_CLIENT_GUIDE.md)** - Complete instructions for pilot clients
- 🚀 **[Production Deployment](PRODUCTION_DEPLOYMENT.md)** - Production setup and deployment guide  
- ⚡ **[Quick Reference](QUICK_REFERENCE.md)** - Quick reference for developers and pilots
- 💡 **[Usage Examples](examples/usage.md)** - Code examples in multiple languages

### Environment Variables

Configure these in your `wrangler.toml` or Cloudflare dashboard:
- `ENVIRONMENT` - Set to "production" for production deployment

## Data Storage

The API uses Cloudflare KV for data persistence with the following key patterns:

- `pilot:{cid}` - Stores pilot data
- `callsign:{CALLSIGN}` - Maps callsigns to CIDs

**KV Namespace:** `USAA_PILOTS`

## Pilot Data Structure

Each pilot record contains the following fields:
- `cid` - Pilot ID (numeric string)
- `callsign` - Aircraft callsign (uppercase)
- `departureAirport` - ICAO code for departure airport (e.g., "KLAX")
- `arrivalAirport` - ICAO code for arrival airport (e.g., "KJFK")
- `airlineId` - Airline identifier code (e.g., "UAL", "AAL")
- `aircraftType` - Aircraft type code (e.g., "B737", "A320")
- `status` - "online" or "offline"
- `onlineTime` - ISO timestamp when pilot came online
- `lastUpdate` - ISO timestamp of last update
- `firstSeen` - ISO timestamp when pilot was first tracked
- `offlineTime` - ISO timestamp when pilot went offline (if applicable)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error details (in development)"
}
```

## CORS Support

The API includes CORS headers to allow cross-origin requests from web applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.