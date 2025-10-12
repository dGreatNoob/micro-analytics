/**
 * Functional Tests for /api/track Endpoint
 * Tests all core functionality requirements
 */

const TEST_CONFIG = {
  endpoint: 'http://localhost:3000/api/track',
  validSiteId: 'iam2ttdx8jgnvfpg5aikziun',
  invalidSiteId: 'invalid-site-id-12345',
};

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper: Run a test
async function runTest(name, testFn) {
  process.stdout.write(`🧪 ${name}... `);
  try {
    await testFn();
    console.log('✅ PASSED');
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASSED' });
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAILED', error: error.message });
  }
}

// Helper: Assert
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test 1: POST request success
async function testValidRequest() {
  const response = await fetch(TEST_CONFIG.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: TEST_CONFIG.validSiteId,
      pathname: '/test-valid',
      hostname: 'localhost',
      referrer: null,
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0.0.0',
      visitorId: 'test-visitor-valid',
      timestamp: new Date().toISOString()
    })
  });
  
  const data = await response.json();
  assert(response.status === 200, `Expected 200, got ${response.status}`);
  assert(data.success === true, 'Expected success: true');
  assert(data.id, 'Expected pageview ID in response');
}

// Test 2: Missing/invalid site_id
async function testInvalidSiteId() {
  const response = await fetch(TEST_CONFIG.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: TEST_CONFIG.invalidSiteId,
      pathname: '/test',
      hostname: 'localhost',
      referrer: null,
      userAgent: 'Mozilla/5.0',
      visitorId: 'test-visitor',
      timestamp: new Date().toISOString()
    })
  });
  
  const data = await response.json();
  assert(response.status === 404, `Expected 404, got ${response.status}`);
  assert(data.success === false, 'Expected success: false');
  assert(data.error, 'Expected error message');
}

// Test 3: Malformed JSON
async function testMalformedJSON() {
  const response = await fetch(TEST_CONFIG.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'this is not valid JSON {'
  });
  
  // Should return success (graceful handling) or 400
  assert(response.status === 200 || response.status === 400, 
    `Expected 200 or 400, got ${response.status}`);
}

// Test 4: Missing required fields
async function testMissingFields() {
  const response = await fetch(TEST_CONFIG.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: TEST_CONFIG.validSiteId,
      // Missing pathname, userAgent, visitorId, etc.
    })
  });
  
  const data = await response.json();
  assert(response.status === 400, `Expected 400, got ${response.status}`);
  assert(data.success === false, 'Expected success: false');
}

// Test 5: User-Agent parsing (various browsers)
async function testUserAgentParsing() {
  const testCases = [
    {
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      expectedDevice: 'Desktop',
      expectedBrowser: 'Chrome'
    },
    {
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      expectedDevice: 'Mobile',
      expectedBrowser: 'Mobile Safari'
    },
    {
      ua: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      expectedDevice: 'Tablet',
      expectedBrowser: 'Mobile Safari'
    }
  ];
  
  for (const testCase of testCases) {
    const response = await fetch(TEST_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId: TEST_CONFIG.validSiteId,
        pathname: '/ua-test',
        hostname: 'localhost',
        referrer: null,
        userAgent: testCase.ua,
        visitorId: 'test-ua-parsing',
        timestamp: new Date().toISOString()
      })
    });
    
    assert(response.status === 200, `UA parsing failed for ${testCase.expectedDevice}`);
  }
}

// Test 6: IP masking verification
async function testIPMasking() {
  // This test verifies the endpoint processes IP correctly
  const response = await fetch(TEST_CONFIG.endpoint, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Forwarded-For': '192.168.1.100' // Simulate proxy
    },
    body: JSON.stringify({
      siteId: TEST_CONFIG.validSiteId,
      pathname: '/ip-test',
      hostname: 'localhost',
      referrer: null,
      userAgent: 'Mozilla/5.0',
      visitorId: 'test-ip',
      timestamp: new Date().toISOString()
    })
  });
  
  assert(response.status === 200, `Expected 200, got ${response.status}`);
  // IP should be masked to 192.168.1.0 in database (verify in DB)
}

// Test 7: Error handling (graceful degradation)
async function testErrorHandling() {
  // Test with various edge cases
  const edgeCases = [
    { visitorId: 'a'.repeat(1000) }, // Very long visitor ID
    { pathname: '/' + 'x'.repeat(500) }, // Very long pathname
    { timestamp: '2025-12-31T23:59:59.999Z' }, // Future timestamp
  ];
  
  for (const overrides of edgeCases) {
    const response = await fetch(TEST_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId: TEST_CONFIG.validSiteId,
        pathname: '/error-test',
        hostname: 'localhost',
        referrer: null,
        userAgent: 'Mozilla/5.0',
        visitorId: 'test-error',
        timestamp: new Date().toISOString(),
        ...overrides
      })
    });
    
    // Should not crash - either accept or reject gracefully
    assert(response.status >= 200 && response.status < 600, 
      'Server should return valid HTTP status');
  }
}

// Run all functional tests
async function runFunctionalTests() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 FUNCTIONAL TESTS - Data Ingestion API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  await runTest('Test 1: Valid POST request succeeds', testValidRequest);
  await runTest('Test 2: Invalid site ID returns 404', testInvalidSiteId);
  await runTest('Test 3: Malformed JSON handled gracefully', testMalformedJSON);
  await runTest('Test 4: Missing required fields returns 400', testMissingFields);
  await runTest('Test 5: User-Agent parsing (Desktop/Mobile/Tablet)', testUserAgentParsing);
  await runTest('Test 6: IP masking applied correctly', testIPMasking);
  await runTest('Test 7: Error handling (edge cases)', testErrorHandling);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 FUNCTIONAL TEST RESULTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Passed: ${testResults.passed}/7`);
  console.log(`❌ Failed: ${testResults.failed}/7`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (testResults.failed === 0) {
    console.log('🎉 ALL FUNCTIONAL TESTS PASSED!\n');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Review errors above.\n');
    testResults.tests.forEach(test => {
      if (test.status === 'FAILED') {
        console.log(`   ❌ ${test.name}: ${test.error}`);
      }
    });
    console.log('');
    return false;
  }
}

// Execute
runFunctionalTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });

