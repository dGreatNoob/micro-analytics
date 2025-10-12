✅ Final Test Requirements — Data Ingestion API (/api/track)
1. Functional Tests

Ensure core logic works correctly.

Test	Description	Expected Result
POST request success	Send a valid payload to /api/track	Returns 200 OK
Missing/invalid site_id	Omit or send invalid site_id	Returns 404 or 400
Malformed JSON	Send invalid JSON	Returns 400
User-Agent parsing	Send various User-Agent headers	Correctly stores browser/device/OS
IP masking	Send request from known IP	IP stored with last octet = 0
DB write	Check DB entry created	Row saved with all required fields
Error handling	Simulate DB down or validation fail	Logs error, returns 500, no crash
2. Performance & Load Tests
Base Load Test (MVP Goal)

Target: 100 requests/second sustained for 1 minute

Tool: k6 or Artillery

Pass Criteria:

✅ Average response time < 100 ms

✅ 95th percentile < 150 ms

✅ Error rate < 1%

✅ No timeouts or memory leaks

Burst Test

Target: 500 requests/second for 5 seconds

Goal: System handles spike without server crash or major degradation

Pass Criteria:

✅ Error rate < 3%

✅ Recovers to normal latency after test

Sustained Stability

Target: 50 requests/second for 5 minutes

Goal: Test connection pooling and memory stability

Pass Criteria:

✅ No connection leaks

✅ Steady CPU/memory usage

✅ Consistent response times

3. Logging & Monitoring Tests
Check	Description	Expected
Error logging	Invalid requests log error with timestamp	Logs visible in console or monitoring tool
Performance metrics	Add timing logs (console.time) for DB writes	Each request shows <100ms total time
Rate limit detection (optional)	Add debug mode to detect throttling	Alerts if requests per second exceed safe limit
4. Security & Data Compliance Tests
Check	Description	Expected
IP anonymization	Last octet of IPv4 masked (e.g. 192.168.1.123 → 192.168.1.0)	✅ Works
Payload sanitization	Reject large/malicious payloads (>10KB)	✅ 400 error
GDPR/Privacy test	Ensure no PII stored	✅ Only anonymized or aggregated data
5. Observability / Validation Outputs

✅ Console shows “Pageview stored” or similar for valid requests

✅ Error messages clearly identify cause (invalid site ID, malformed body, etc.)

✅ DB shows anonymized IP, parsed UA fields, and correct timestamps

6. Tools & Scripts

Load Testing: k6 (preferred) or Artillery

Monitoring: Supabase logs, Vercel functions dashboard

Database Check: SELECT * FROM pageviews ORDER BY created_at DESC LIMIT 5;

Optional profiling: clinic.js or node --prof for CPU/memory insight

✅ Definition of Done (Final Version)

 Endpoint accepts and validates POST requests

 Site ID validation works

 User-Agent parsed correctly (ua-parser-js)

 Pageview saved to PostgreSQL

 IP masking verified

 Handles 100 req/s sustained for 1 minute (<150 ms avg)

 Handles 500 req/s burst (no crash, <3% error)

 Logs errors clearly

 GDPR-safe (no personal data stored)

 System stable for 5-minute load test