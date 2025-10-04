# API Usage Examples

## Setting a pilot online

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/pilots/online \
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

## Getting all online pilots

```bash
curl https://your-worker.your-subdomain.workers.dev/pilots
```

## Getting a specific pilot by CID

```bash
curl https://your-worker.your-subdomain.workers.dev/pilots/1234567
```

## Getting a pilot by callsign

```bash
curl https://your-worker.your-subdomain.workers.dev/callsign/UAL123
```

## Setting a pilot offline

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/pilots/offline \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "1234567"
  }'
```

## Removing a pilot from tracking

```bash
curl -X DELETE https://your-worker.your-subdomain.workers.dev/pilots/1234567
```

## JavaScript/Frontend Integration

```javascript
// Set pilot online
async function setPilotOnline(cid, callsign, departureAirport, arrivalAirport, airlineId, aircraftType) {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/pilots/online', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cid: cid,
      callsign: callsign,
      departureAirport: departureAirport,
      arrivalAirport: arrivalAirport,
      airlineId: airlineId,
      aircraftType: aircraftType
    })
  });
  
  const data = await response.json();
  return data;
}

// Get all online pilots
async function getOnlinePilots() {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/pilots');
  const data = await response.json();
  return data.data; // Array of pilots
}

// Get pilot by CID
async function getPilotByCid(cid) {
  const response = await fetch(`https://your-worker.your-subdomain.workers.dev/pilots/${cid}`);
  const data = await response.json();
  return data.data;
}

// Set pilot offline
async function setPilotOffline(cid) {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/pilots/offline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cid: cid
    })
  });
  
  const data = await response.json();
  return data;
}
```

## Python Integration

```python
import requests
import json

API_BASE_URL = "https://your-worker.your-subdomain.workers.dev"

def set_pilot_online(cid, callsign, departure_airport, arrival_airport, airline_id, aircraft_type):
    """Set a pilot as online"""
    url = f"{API_BASE_URL}/pilots/online"
    payload = {
        "cid": cid,
        "callsign": callsign,
        "departureAirport": departure_airport,
        "arrivalAirport": arrival_airport,
        "airlineId": airline_id,
        "aircraftType": aircraft_type
    }
    response = requests.post(url, json=payload)
    return response.json()

def get_online_pilots():
    """Get all online pilots"""
    url = f"{API_BASE_URL}/pilots"
    response = requests.get(url)
    data = response.json()
    return data.get("data", [])

def get_pilot_by_cid(cid):
    """Get pilot by CID"""
    url = f"{API_BASE_URL}/pilots/{cid}"
    response = requests.get(url)
    return response.json()

def set_pilot_offline(cid):
    """Set a pilot as offline"""
    url = f"{API_BASE_URL}/pilots/offline"
    payload = {"cid": cid}
    response = requests.post(url, json=payload)
    return response.json()

# Example usage
if __name__ == "__main__":
    # Set pilot online
    result = set_pilot_online("1234567", "UAL123", "KLAX", "KJFK", "UAL", "B737")
    print("Pilot online:", result)
    
    # Get all pilots
    pilots = get_online_pilots()
    print(f"Found {len(pilots)} online pilots")
    
    # Set pilot offline
    result = set_pilot_offline("1234567")
    print("Pilot offline:", result)
```

## React Integration Example

```jsx
import React, { useState, useEffect } from 'react';

const PilotTracker = () => {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    try {
      const response = await fetch('https://your-worker.your-subdomain.workers.dev/pilots');
      const data = await response.json();
      setPilots(data.data || []);
    } catch (error) {
      console.error('Error fetching pilots:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPilot = async (pilotData) => {
    try {
      const response = await fetch('https://your-worker.your-subdomain.workers.dev/pilots/online', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pilotData)
      });
      
      if (response.ok) {
        fetchPilots(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding pilot:', error);
    }
  };

  if (loading) return <div>Loading pilots...</div>;

  return (
    <div>
      <h2>Online Pilots</h2>
      <div className="pilots-grid">
        {pilots.map(pilot => (
          <div key={pilot.cid} className="pilot-card">
            <h3>{pilot.callsign}</h3>
            <p><strong>Airline:</strong> {pilot.airlineId}</p>
            <p><strong>Aircraft:</strong> {pilot.aircraftType}</p>
            <p><strong>Route:</strong> {pilot.departureAirport} → {pilot.arrivalAirport}</p>
            <p><strong>CID:</strong> {pilot.cid}</p>
            <p><strong>Online since:</strong> {new Date(pilot.onlineTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PilotTracker;
```