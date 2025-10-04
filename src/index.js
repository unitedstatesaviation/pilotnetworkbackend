import { Router } from 'itty-router';

// Create a new router
const router = Router();

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper function to add CORS headers to responses
function addCorsHeaders(response) {
  Object.keys(corsHeaders).forEach(key => {
    response.headers.set(key, corsHeaders[key]);
  });
  return response;
}

// Helper function to create JSON response with CORS
function jsonResponse(data, status = 200) {
  const response = new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
  return response;
}

// Helper function to get current timestamp
function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Helper function to generate pilot key for KV storage
function getPilotKey(cid) {
  return `pilot:${cid}`;
}

// Helper function to generate callsign index key
function getCallsignKey(callsign) {
  return `callsign:${callsign.toUpperCase()}`;
}

// Handle OPTIONS requests for CORS preflight
router.options('*', () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
});

// GET / - API information
router.get('/', () => {
  return jsonResponse({
    name: 'United States Aviation Administrator (USAA) API',
    version: '1.0.0',
    description: 'API for tracking aviation pilots and flight status',
    endpoints: {
      'GET /': 'API information',
      'GET /pilots': 'List all online pilots',
      'GET /pilots/:cid': 'Get specific pilot by CID',
      'GET /callsign/:callsign': 'Get pilot by callsign',
      'POST /pilots/online': 'Set pilot as online',
      'POST /pilots/offline': 'Set pilot as offline',
      'DELETE /pilots/:cid': 'Remove pilot from tracking'
    }
  });
});

// GET /pilots - List all online pilots
router.get('/pilots', async (request, env) => {
  try {
    // Get all pilot keys
    const list = await env.USAA_PILOTS.list({ prefix: 'pilot:' });
    const pilots = [];

    // Fetch all pilot data
    for (const key of list.keys) {
      const pilotData = await env.USAA_PILOTS.get(key.name, 'json');
      if (pilotData && pilotData.status === 'online') {
        pilots.push(pilotData);
      }
    }

    // Sort by online time (most recent first)
    pilots.sort((a, b) => new Date(b.onlineTime) - new Date(a.onlineTime));

    return jsonResponse({
      success: true,
      data: pilots,
      count: pilots.length,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to fetch pilots',
      details: error.message
    }, 500);
  }
});

// GET /pilots/:cid - Get specific pilot by CID
router.get('/pilots/:cid', async (request, env) => {
  try {
    const { cid } = request.params;
    
    if (!cid || !/^\d+$/.test(cid)) {
      return jsonResponse({
        success: false,
        error: 'Invalid CID format. CID must be numeric.'
      }, 400);
    }

    const pilotData = await env.USAA_PILOTS.get(getPilotKey(cid), 'json');
    
    if (!pilotData) {
      return jsonResponse({
        success: false,
        error: 'Pilot not found'
      }, 404);
    }

    return jsonResponse({
      success: true,
      data: pilotData,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to fetch pilot',
      details: error.message
    }, 500);
  }
});

// GET /callsign/:callsign - Get pilot by callsign
router.get('/callsign/:callsign', async (request, env) => {
  try {
    const { callsign } = request.params;
    
    if (!callsign || callsign.length < 2) {
      return jsonResponse({
        success: false,
        error: 'Invalid callsign format'
      }, 400);
    }

    const callsignKey = getCallsignKey(callsign);
    const cid = await env.USAA_PILOTS.get(callsignKey);
    
    if (!cid) {
      return jsonResponse({
        success: false,
        error: 'Callsign not found'
      }, 404);
    }

    const pilotData = await env.USAA_PILOTS.get(getPilotKey(cid), 'json');
    
    if (!pilotData) {
      return jsonResponse({
        success: false,
        error: 'Pilot data not found'
      }, 404);
    }

    return jsonResponse({
      success: true,
      data: pilotData,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to fetch pilot by callsign',
      details: error.message
    }, 500);
  }
});

// POST /pilots/online - Set pilot as online
router.post('/pilots/online', async (request, env) => {
  try {
    const body = await request.json();
    const { cid, callsign, departureAirport, arrivalAirport, airlineId, aircraftType } = body;

    // Validate input
    if (!cid || !callsign || !departureAirport || !arrivalAirport || !airlineId || !aircraftType) {
      return jsonResponse({
        success: false,
        error: 'Missing required fields: cid, callsign, departureAirport, arrivalAirport, airlineId, and aircraftType'
      }, 400);
    }

    if (!/^\d+$/.test(cid.toString())) {
      return jsonResponse({
        success: false,
        error: 'Invalid CID format. CID must be numeric.'
      }, 400);
    }

    if (typeof callsign !== 'string' || callsign.length < 2) {
      return jsonResponse({
        success: false,
        error: 'Invalid callsign format'
      }, 400);
    }

    if (typeof departureAirport !== 'string' || departureAirport.length < 3) {
      return jsonResponse({
        success: false,
        error: 'Invalid departure airport format. Must be at least 3 characters.'
      }, 400);
    }

    if (typeof arrivalAirport !== 'string' || arrivalAirport.length < 3) {
      return jsonResponse({
        success: false,
        error: 'Invalid arrival airport format. Must be at least 3 characters.'
      }, 400);
    }

    if (typeof airlineId !== 'string' || airlineId.length < 2) {
      return jsonResponse({
        success: false,
        error: 'Invalid airline ID format. Must be at least 2 characters.'
      }, 400);
    }

    if (typeof aircraftType !== 'string' || aircraftType.length < 2) {
      return jsonResponse({
        success: false,
        error: 'Invalid aircraft type format. Must be at least 2 characters.'
      }, 400);
    }

    const normalizedCallsign = callsign.toUpperCase();
    const normalizedDeparture = departureAirport.toUpperCase();
    const normalizedArrival = arrivalAirport.toUpperCase();
    const normalizedAircraftType = aircraftType.toUpperCase();
    const pilotKey = getPilotKey(cid);
    const callsignKey = getCallsignKey(normalizedCallsign);
    const currentTime = getCurrentTimestamp();

    // Check if callsign is already in use by another pilot
    const existingCid = await env.USAA_PILOTS.get(callsignKey);
    if (existingCid && existingCid !== cid.toString()) {
      return jsonResponse({
        success: false,
        error: 'Callsign already in use by another pilot'
      }, 409);
    }

    // Get existing pilot data if any
    const existingPilot = await env.USAA_PILOTS.get(pilotKey, 'json');
    
    // If pilot was using a different callsign, clean up old callsign mapping
    if (existingPilot && existingPilot.callsign !== normalizedCallsign) {
      const oldCallsignKey = getCallsignKey(existingPilot.callsign);
      await env.USAA_PILOTS.delete(oldCallsignKey);
    }

    const pilotData = {
      cid: cid.toString(),
      callsign: normalizedCallsign,
      departureAirport: normalizedDeparture,
      arrivalAirport: normalizedArrival,
      airlineId: airlineId,
      aircraftType: normalizedAircraftType,
      status: 'online',
      onlineTime: currentTime,
      lastUpdate: currentTime,
      ...(existingPilot && existingPilot.firstSeen ? { firstSeen: existingPilot.firstSeen } : { firstSeen: currentTime })
    };

    // Store pilot data and callsign mapping
    await Promise.all([
      env.USAA_PILOTS.put(pilotKey, JSON.stringify(pilotData)),
      env.USAA_PILOTS.put(callsignKey, cid.toString())
    ]);

    return jsonResponse({
      success: true,
      message: 'Pilot set as online',
      data: pilotData,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to set pilot online',
      details: error.message
    }, 500);
  }
});

// POST /pilots/offline - Set pilot as offline
router.post('/pilots/offline', async (request, env) => {
  try {
    const body = await request.json();
    const { cid } = body;

    if (!cid || !/^\d+$/.test(cid.toString())) {
      return jsonResponse({
        success: false,
        error: 'Invalid or missing CID'
      }, 400);
    }

    const pilotKey = getPilotKey(cid);
    const existingPilot = await env.USAA_PILOTS.get(pilotKey, 'json');
    
    if (!existingPilot) {
      return jsonResponse({
        success: false,
        error: 'Pilot not found'
      }, 404);
    }

    const currentTime = getCurrentTimestamp();
    const pilotData = {
      ...existingPilot,
      status: 'offline',
      lastUpdate: currentTime,
      offlineTime: currentTime
    };

    // Update pilot data and remove callsign mapping
    const callsignKey = getCallsignKey(existingPilot.callsign);
    await Promise.all([
      env.USAA_PILOTS.put(pilotKey, JSON.stringify(pilotData)),
      env.USAA_PILOTS.delete(callsignKey)
    ]);

    return jsonResponse({
      success: true,
      message: 'Pilot set as offline',
      data: pilotData,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to set pilot offline',
      details: error.message
    }, 500);
  }
});

// DELETE /pilots/:cid - Remove pilot from tracking
router.delete('/pilots/:cid', async (request, env) => {
  try {
    const { cid } = request.params;
    
    if (!cid || !/^\d+$/.test(cid)) {
      return jsonResponse({
        success: false,
        error: 'Invalid CID format'
      }, 400);
    }

    const pilotKey = getPilotKey(cid);
    const existingPilot = await env.USAA_PILOTS.get(pilotKey, 'json');
    
    if (!existingPilot) {
      return jsonResponse({
        success: false,
        error: 'Pilot not found'
      }, 404);
    }

    // Remove both pilot data and callsign mapping
    const callsignKey = getCallsignKey(existingPilot.callsign);
    await Promise.all([
      env.USAA_PILOTS.delete(pilotKey),
      env.USAA_PILOTS.delete(callsignKey)
    ]);

    return jsonResponse({
      success: true,
      message: 'Pilot removed from tracking',
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to remove pilot',
      details: error.message
    }, 500);
  }
});

// 404 handler
router.all('*', () => {
  return jsonResponse({
    success: false,
    error: 'Endpoint not found'
  }, 404);
});

// Main export for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  }
};