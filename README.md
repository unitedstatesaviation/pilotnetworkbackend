# United States Aviation Administrator (USAA) Backend API

A Cloudflare Workers-based backend API for the United States Aviation Administrator (USAA) system. This API tracks and manages aviation controller data including callsign, Controller ID (CID), and online time for comprehensive aviation network monitoring.

## Features

- Track aviation controller online/offline status
- Store callsign and CID mapping for USAA network
- RESTful API with JSON responses
- CORS support for web applications
- Deployable to Cloudflare Workers or Pages
- Uses Cloudflare KV for data persistence
- Designed for United States Aviation Administrator operations

## API Endpoints

### GET /
Returns API information and available endpoints.

### GET /controllers
Returns a list of all currently online controllers, sorted by most recent online time.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "cid": "1234567",
      "callsign": "LAX_TWR",
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

### GET /controllers/:cid
Returns information about a specific controller by their CID.

**Parameters:**
- `cid` - Controller ID (numeric)

### GET /callsign/:callsign
Returns controller information by their callsign.

**Parameters:**
- `callsign` - Controller callsign (case-insensitive)

### POST /controllers/online
Sets a controller as online.

**Body:**
```json
{
  "cid": "1234567",
  "callsign": "LAX_TWR"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Controller set as online",
  "data": {
    "cid": "1234567",
    "callsign": "LAX_TWR",
    "status": "online",
    "onlineTime": "2024-01-01T12:00:00.000Z",
    "lastUpdate": "2024-01-01T12:00:00.000Z",
    "firstSeen": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### POST /controllers/offline
Sets a controller as offline.

**Body:**
```json
{
  "cid": "1234567"
}
```

### DELETE /controllers/:cid
Removes a controller from tracking completely.

**Parameters:**
- `cid` - Controller ID (numeric)

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
wrangler kv:namespace create "USAA_CONTROLLERS"
wrangler kv:namespace create "USAA_CONTROLLERS" --preview

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

### Environment Variables

Configure these in your `wrangler.toml` or Cloudflare dashboard:
- `ENVIRONMENT` - Set to "production" for production deployment

## Data Storage

The API uses Cloudflare KV for data persistence with the following key patterns:

- `controller:{cid}` - Stores controller data
- `callsign:{CALLSIGN}` - Maps callsigns to CIDs

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