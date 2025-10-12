/**
 * Realistic Load Test
 * Spreads requests evenly over time (not all at once)
 * This simulates real-world traffic patterns
 */

const TEST_CONFIG = {
  endpoint: 'http://localhost:3000/api/track',
  siteId: 'iam2ttdx8jgnvfpg5aikziun',
};

function generatePageview(index) {
  return {
    siteId: TEST_CONFIG.siteId,
    pathname: `/realistic-test/${index}`,
    hostname: 'localhost',
    referrer: index % 3 === 0 ? 'https://google.com' : null,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0.0.0',
    visitorId: `visitor-${index % 30}`,
    timestamp: new Date().toISOString()
  };
}

async function sendRequest(index) {
  const start = Date.now();
  try {
    const response = await fetch(TEST_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generatePageview(index))
    });
    return {
      success: response.ok,
      duration: Date.now() - start,
      error: !response.ok
    };
  } catch (error) {
    return { success: false, error: true, duration: Date.now() - start };
  }
}

// Send requests evenly distributed over time
async function sendRequestsSpread(count, durationMs) {
  const interval = durationMs / count;
  const promises = [];
  const startTime = Date.now();
  
  for (let i = 0; i < count; i++) {
    const targetTime = startTime + (i * interval);
    const delay = targetTime - Date.now();
    
    if (delay > 0) {
      await new Promise(r => setTimeout(r, delay));
    }
    
    promises.push(sendRequest(i));
  }
  
  return Promise.all(promises);
}

function analyzeResults(results, testName, targets) {
  const successful = results.filter(r => r.success);
  const errors = results.filter(r => r.error);
  const durations = successful.map(r => r.duration).sort((a, b) => a - b);
  
  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length || 0;
  const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
  const p99 = durations[Math.floor(durations.length * 0.99)] || 0;
  const errorRate = (errors.length / results.length) * 100;
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 ${testName} RESULTS`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📤 Total:      ${results.length}`);
  console.log(`✅ Success:    ${successful.length} (${(successful.length/results.length*100).toFixed(1)}%)`);
  console.log(`❌ Errors:     ${errors.length} (${errorRate.toFixed(2)}%)`);
  console.log(``);
  console.log(`⚡ Response Times:`);
  console.log(`   Avg:  ${avgDuration.toFixed(2)}ms (target: <${targets.avgTarget}ms)`);
  console.log(`   P95:  ${p95}ms (target: <${targets.p95Target}ms)`);
  console.log(`   P99:  ${p99}ms`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  const passedAvg = avgDuration < targets.avgTarget;
  const passedP95 = p95 < targets.p95Target;
  const passedError = errorRate < targets.errorTarget;
  const passed = passedAvg && passedP95 && passedError;
  
  console.log(`\n✅ CRITERIA CHECK:`);
  console.log(`   Avg < ${targets.avgTarget}ms:     ${passedAvg ? '✅ PASS' : '❌ FAIL'} (${avgDuration.toFixed(2)}ms)`);
  console.log(`   P95 < ${targets.p95Target}ms:        ${passedP95 ? '✅ PASS' : '❌ FAIL'} (${p95}ms)`);
  console.log(`   Error < ${targets.errorTarget}%:      ${passedError ? '✅ PASS' : '❌ FAIL'} (${errorRate.toFixed(2)}%)`);
  console.log(`\n🎯 ${testName}: ${passed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
  return passed;
}

async function runRealisticTests() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌍 REALISTIC LOAD TESTS (Evenly Distributed)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 1: 100 req/s for 10 seconds (spread evenly)
  console.log('📊 TEST 1: 100 req/s for 10 seconds (requests spread evenly)');
  console.log('⏱️  Sending 1000 requests over 10 seconds...\n');
  const test1Results = await sendRequestsSpread(1000, 10000);
  const test1Passed = analyzeResults(test1Results, 'BASE LOAD (Realistic)', { 
    avgTarget: 100, 
    p95Target: 150, 
    errorTarget: 1 
  });
  
  // Wait between tests
  console.log('Waiting 3 seconds...\n');
  await new Promise(r => setTimeout(r, 3000));
  
  // Test 2: 50 req/s for 30 seconds (sustained)
  console.log('📊 TEST 2: 50 req/s for 30 seconds (sustained load)');
  console.log('⏱️  Sending 1500 requests over 30 seconds...\n');
  const test2Results = await sendRequestsSpread(1500, 30000);
  const test2Passed = analyzeResults(test2Results, 'SUSTAINED (Realistic)', { 
    avgTarget: 100, 
    p95Target: 150, 
    errorTarget: 1 
  });
  
  //Final summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏆 REALISTIC LOAD TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Base Load (100 req/s):  ${test1Passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Sustained (50 req/s):   ${test2Passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (test1Passed && test2Passed) {
    console.log('🎉 ALL REALISTIC LOAD TESTS PASSED!');
    console.log('✅ API meets performance criteria for real-world traffic!\n');
  }
  
  return test1Passed && test2Passed;
}

runRealisticTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

