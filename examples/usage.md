# API Usage Examples

## Setting a controller online

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/controllers/online \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "1234567",
    "callsign": "LAX_TWR"
  }'
```

## Getting all online controllers

```bash
curl https://your-worker.your-subdomain.workers.dev/controllers
```

## Getting a specific controller by CID

```bash
curl https://your-worker.your-subdomain.workers.dev/controllers/1234567
```

## Getting a controller by callsign

```bash
curl https://your-worker.your-subdomain.workers.dev/callsign/LAX_TWR
```

## Setting a controller offline

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/controllers/offline \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "1234567"
  }'
```

## Removing a controller from tracking

```bash
curl -X DELETE https://your-worker.your-subdomain.workers.dev/controllers/1234567
```

## JavaScript/Frontend Integration

```javascript
// Set controller online
async function setControllerOnline(cid, callsign) {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/controllers/online', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cid: cid,
      callsign: callsign
    })
  });
  
  const data = await response.json();
  return data;
}

// Get all online controllers
async function getOnlineControllers() {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/controllers');
  const data = await response.json();
  return data.data; // Array of controllers
}

// Get controller by CID
async function getControllerByCid(cid) {
  const response = await fetch(`https://your-worker.your-subdomain.workers.dev/controllers/${cid}`);
  const data = await response.json();
  return data.data;
}

// Set controller offline
async function setControllerOffline(cid) {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/controllers/offline', {
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

def set_controller_online(cid, callsign):
    """Set a controller as online"""
    url = f"{API_BASE_URL}/controllers/online"
    payload = {
        "cid": cid,
        "callsign": callsign
    }
    response = requests.post(url, json=payload)
    return response.json()

def get_online_controllers():
    """Get all online controllers"""
    url = f"{API_BASE_URL}/controllers"
    response = requests.get(url)
    data = response.json()
    return data.get("data", [])

def get_controller_by_cid(cid):
    """Get controller by CID"""
    url = f"{API_BASE_URL}/controllers/{cid}"
    response = requests.get(url)
    return response.json()

def set_controller_offline(cid):
    """Set a controller as offline"""
    url = f"{API_BASE_URL}/controllers/offline"
    payload = {"cid": cid}
    response = requests.post(url, json=payload)
    return response.json()

# Example usage
if __name__ == "__main__":
    # Set controller online
    result = set_controller_online("1234567", "LAX_TWR")
    print("Controller online:", result)
    
    # Get all controllers
    controllers = get_online_controllers()
    print(f"Found {len(controllers)} online controllers")
    
    # Set controller offline
    result = set_controller_offline("1234567")
    print("Controller offline:", result)
```