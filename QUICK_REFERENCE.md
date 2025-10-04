# USAA Pilot Network - Quick Reference

## 🛩️ Connection Endpoints

### Production API
**`https://pilotnet.unitedstatesaviation.us`**

### Development/Testing API
**`https://usaa-pilot-tracker.sebpartof2.workers.dev`**

---

## 🔌 Connect to Network

**POST** `/pilots/online`

```json
{
  "cid": "YOUR_PILOT_ID",
  "callsign": "YOUR_CALLSIGN",
  "departureAirport": "KLAX",
  "arrivalAirport": "KJFK", 
  "airlineId": "UAL",
  "aircraftType": "B737"
}
```

---

## 🔌 Disconnect from Network

**POST** `/pilots/offline`

```json
{
  "cid": "YOUR_PILOT_ID"
}
```

---

## 📊 Check Status

**GET** `/pilots/YOUR_PILOT_ID`

**GET** `/callsign/YOUR_CALLSIGN`

**GET** `/pilots` *(all online pilots)*

---

## ✅ Required Fields

| Field | Example | Description |
|-------|---------|-------------|
| `cid` | `"1234567"` | Your pilot ID (numeric) |
| `callsign` | `"UAL123"` | Aircraft callsign |
| `departureAirport` | `"KLAX"` | ICAO departure code |
| `arrivalAirport` | `"KJFK"` | ICAO arrival code |
| `airlineId` | `"UAL"` | Airline identifier |
| `aircraftType` | `"B737"` | Aircraft type code |

---

## 🔧 Quick Test Commands

### Connect
```bash
curl -X POST https://pilotnet.unitedstatesaviation.us/pilots/online \
  -H "Content-Type: application/json" \
  -d '{"cid":"1234567","callsign":"UAL123","departureAirport":"KLAX","arrivalAirport":"KJFK","airlineId":"UAL","aircraftType":"B737"}'
```

### Disconnect  
```bash
curl -X POST https://pilotnet.unitedstatesaviation.us/pilots/offline \
  -H "Content-Type: application/json" \
  -d '{"cid":"1234567"}'
```

### Check Status
```bash
curl https://pilotnet.unitedstatesaviation.us/pilots/1234567
```

---

## ⚠️ Important Notes

- **Callsigns must be unique** - you'll get an error if another pilot is using your callsign
- **Always disconnect** when ending your session
- **Use ICAO codes** for airports (KLAX, KJFK, EGLL, etc.)
- **All fields are required** when connecting

---

## 📞 Support
For technical support, refer to the full `PILOT_CLIENT_GUIDE.md` documentation.