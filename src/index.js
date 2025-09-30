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

// Helper function to generate controller key for KV storage
function getControllerKey(cid) {
  return `controller:${cid}`;
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
    description: 'API for tracking aviation controllers and network status',
    endpoints: {
      'GET /': 'API information',
      'GET /controllers': 'List all online controllers',
      'GET /controllers/:cid': 'Get specific controller by CID',
      'GET /callsign/:callsign': 'Get controller by callsign',
      'POST /controllers/online': 'Set controller as online',
      'POST /controllers/offline': 'Set controller as offline',
      'DELETE /controllers/:cid': 'Remove controller from tracking'
    }
  });
});

// GET /controllers - List all online controllers
router.get('/controllers', async (request, env) => {
  try {
    // Get all controller keys
    const list = await env.USAA_CONTROLLERS.list({ prefix: 'controller:' });
    const controllers = [];

    // Fetch all controller data
    for (const key of list.keys) {
      const controllerData = await env.USAA_CONTROLLERS.get(key.name, 'json');
      if (controllerData && controllerData.status === 'online') {
        controllers.push(controllerData);
      }
    }

    // Sort by online time (most recent first)
    controllers.sort((a, b) => new Date(b.onlineTime) - new Date(a.onlineTime));

    return jsonResponse({
      success: true,
      data: controllers,
      count: controllers.length,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to fetch controllers',
      details: error.message
    }, 500);
  }
});

// GET /controllers/:cid - Get specific controller by CID
router.get('/controllers/:cid', async (request, env) => {
  try {
    const { cid } = request.params;
    
    if (!cid || !/^\d+$/.test(cid)) {
      return jsonResponse({
        success: false,
        error: 'Invalid CID format. CID must be numeric.'
      }, 400);
    }

    const controllerData = await env.USAA_CONTROLLERS.get(getControllerKey(cid), 'json');
    
    if (!controllerData) {
      return jsonResponse({
        success: false,
        error: 'Controller not found'
      }, 404);
    }

    return jsonResponse({
      success: true,
      data: controllerData,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to fetch controller',
      details: error.message
    }, 500);
  }
});

// GET /callsign/:callsign - Get controller by callsign
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
    const cid = await env.USAA_CONTROLLERS.get(callsignKey);
    
    if (!cid) {
      return jsonResponse({
        success: false,
        error: 'Callsign not found'
      }, 404);
    }

    const controllerData = await env.USAA_CONTROLLERS.get(getControllerKey(cid), 'json');
    
    if (!controllerData) {
      return jsonResponse({
        success: false,
        error: 'Controller data not found'
      }, 404);
    }

    return jsonResponse({
      success: true,
      data: controllerData,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to fetch controller by callsign',
      details: error.message
    }, 500);
  }
});

// POST /controllers/online - Set controller as online
router.post('/controllers/online', async (request, env) => {
  try {
    const body = await request.json();
    const { cid, callsign } = body;

    // Validate input
    if (!cid || !callsign) {
      return jsonResponse({
        success: false,
        error: 'Missing required fields: cid and callsign'
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

    const normalizedCallsign = callsign.toUpperCase();
    const controllerKey = getControllerKey(cid);
    const callsignKey = getCallsignKey(normalizedCallsign);
    const currentTime = getCurrentTimestamp();

    // Check if callsign is already in use by another controller
    const existingCid = await env.USAA_CONTROLLERS.get(callsignKey);
    if (existingCid && existingCid !== cid.toString()) {
      return jsonResponse({
        success: false,
        error: 'Callsign already in use by another controller'
      }, 409);
    }

    // Get existing controller data if any
    const existingController = await env.USAA_CONTROLLERS.get(controllerKey, 'json');
    
    // If controller was using a different callsign, clean up old callsign mapping
    if (existingController && existingController.callsign !== normalizedCallsign) {
      const oldCallsignKey = getCallsignKey(existingController.callsign);
      await env.USAA_CONTROLLERS.delete(oldCallsignKey);
    }

    const controllerData = {
      cid: cid.toString(),
      callsign: normalizedCallsign,
      status: 'online',
      onlineTime: currentTime,
      lastUpdate: currentTime,
      ...(existingController && existingController.firstSeen ? { firstSeen: existingController.firstSeen } : { firstSeen: currentTime })
    };

    // Store controller data and callsign mapping
    await Promise.all([
      env.USAA_CONTROLLERS.put(controllerKey, JSON.stringify(controllerData)),
      env.USAA_CONTROLLERS.put(callsignKey, cid.toString())
    ]);

    return jsonResponse({
      success: true,
      message: 'Controller set as online',
      data: controllerData,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to set controller online',
      details: error.message
    }, 500);
  }
});

// POST /controllers/offline - Set controller as offline
router.post('/controllers/offline', async (request, env) => {
  try {
    const body = await request.json();
    const { cid } = body;

    if (!cid || !/^\d+$/.test(cid.toString())) {
      return jsonResponse({
        success: false,
        error: 'Invalid or missing CID'
      }, 400);
    }

    const controllerKey = getControllerKey(cid);
    const existingController = await env.USAA_CONTROLLERS.get(controllerKey, 'json');
    
    if (!existingController) {
      return jsonResponse({
        success: false,
        error: 'Controller not found'
      }, 404);
    }

    const currentTime = getCurrentTimestamp();
    const controllerData = {
      ...existingController,
      status: 'offline',
      lastUpdate: currentTime,
      offlineTime: currentTime
    };

    // Update controller data and remove callsign mapping
    const callsignKey = getCallsignKey(existingController.callsign);
    await Promise.all([
      env.USAA_CONTROLLERS.put(controllerKey, JSON.stringify(controllerData)),
      env.USAA_CONTROLLERS.delete(callsignKey)
    ]);

    return jsonResponse({
      success: true,
      message: 'Controller set as offline',
      data: controllerData,
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to set controller offline',
      details: error.message
    }, 500);
  }
});

// DELETE /controllers/:cid - Remove controller from tracking
router.delete('/controllers/:cid', async (request, env) => {
  try {
    const { cid } = request.params;
    
    if (!cid || !/^\d+$/.test(cid)) {
      return jsonResponse({
        success: false,
        error: 'Invalid CID format'
      }, 400);
    }

    const controllerKey = getControllerKey(cid);
    const existingController = await env.USAA_CONTROLLERS.get(controllerKey, 'json');
    
    if (!existingController) {
      return jsonResponse({
        success: false,
        error: 'Controller not found'
      }, 404);
    }

    // Remove both controller data and callsign mapping
    const callsignKey = getCallsignKey(existingController.callsign);
    await Promise.all([
      env.USAA_CONTROLLERS.delete(controllerKey),
      env.USAA_CONTROLLERS.delete(callsignKey)
    ]);

    return jsonResponse({
      success: true,
      message: 'Controller removed from tracking',
      timestamp: getCurrentTimestamp()
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: 'Failed to remove controller',
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