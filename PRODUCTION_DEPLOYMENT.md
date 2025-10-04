# Production Deployment Guide

## Domain Configuration

### Current Setup
- **Development/Testing:** https://usaa-pilot-tracker.sebpartof2.workers.dev
- **Production Target:** https://pilotnet.unitedstatesaviation.us

## Steps to Deploy to Production Domain

### 1. Configure Custom Domain in Cloudflare

1. **Add Domain to Cloudflare:**
   - Log into Cloudflare Dashboard
   - Add `unitedstatesaviation.us` domain (if not already added)
   - Update nameservers to Cloudflare

2. **Set up Custom Subdomain:**
   - Go to Workers & Pages → Custom domains
   - Add `pilotnet.unitedstatesaviation.us`
   - Map it to the `usaa-pilot-tracker` worker

### 2. Update DNS Records

Add the following DNS record in Cloudflare:
```
Type: CNAME
Name: pilotnet
Content: usaa-pilot-tracker.sebpartof2.workers.dev
Proxy: Enabled (Orange cloud)
```

### 3. SSL Configuration

- Cloudflare will automatically provision SSL certificates
- Ensure SSL/TLS encryption mode is set to "Full" or "Full (strict)"
- The API will be available at `https://pilotnet.unitedstatesaviation.us`

### 4. Production Environment Configuration

Create a production-specific wrangler configuration:

```toml
# wrangler.production.toml
name = "usaa-pilot-tracker-production"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "production"

[[kv_namespaces]]
binding = "USAA_PILOTS"
id = "47bc476c9bb04bdea4a4eb5424122e60"
preview_id = "fbffca54ee214babb24f933f7873c772"

# Custom domain will be configured in Cloudflare Dashboard
```

### 5. Deploy to Production

```bash
# Deploy with production configuration
npx wrangler deploy --config wrangler.production.toml

# Or deploy to production environment
npx wrangler deploy --env production
```

### 6. Verify Production Deployment

Test the production API:
```bash
# Test API info
curl https://pilotnet.unitedstatesaviation.us/

# Test pilot connection
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

## Environment-Specific Configurations

### Development
- **URL:** https://usaa-pilot-tracker.sebpartof2.workers.dev
- **Purpose:** Testing and development
- **KV Namespace:** Same as production (shared data)

### Production
- **URL:** https://pilotnet.unitedstatesaviation.us
- **Purpose:** Live pilot network operations
- **KV Namespace:** Production pilot data

## Monitoring and Maintenance

### 1. Health Checks
Set up monitoring for:
- API endpoint availability
- Response times
- Error rates
- KV storage usage

### 2. Backup Strategy
- KV data is automatically replicated by Cloudflare
- Consider periodic exports of critical pilot data
- Monitor KV namespace usage limits

### 3. Updates and Deployments
```bash
# Standard deployment command for production
npx wrangler deploy

# View deployment logs
npx wrangler tail

# Check worker analytics
npx wrangler analytics
```

## Security Considerations

### 1. Rate Limiting
Consider implementing rate limiting for production:
```javascript
// Add to worker code if needed
const rateLimiter = {
  // Implementation depends on requirements
}
```

### 2. API Authentication
For enhanced security, consider adding:
- API key authentication
- JWT tokens for pilot sessions
- IP whitelisting for administrative endpoints

### 3. CORS Configuration
Current CORS allows all origins (`*`). For production, consider:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://unitedstatesaviation.us',
  // More restrictive CORS policy
};
```

## Rollback Procedures

### Quick Rollback
```bash
# Rollback to previous version
npx wrangler rollback [VERSION_ID]
```

### Emergency Procedures
1. Check Cloudflare Dashboard for worker status
2. Review recent deployments in Wrangler
3. Use Cloudflare's quick rollback feature
4. Monitor error logs and metrics

## Support and Documentation

### Cloudflare Resources
- [Workers Documentation](https://developers.cloudflare.com/workers/)
- [KV Storage Guide](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

### Project Documentation
- `README.md` - Main project documentation
- `PILOT_CLIENT_GUIDE.md` - Client connection instructions
- `examples/usage.md` - API usage examples