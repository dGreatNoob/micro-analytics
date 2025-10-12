/**
 * Quick Performance Tests (Lighter Version)
 * Tests core performance requirements in ~2 minutes
 */

const TEST_CONFIG = {
  endpoint: 'http://localhost:3000/api/track',
  siteId: 'iam2ttdx8jgnvfpg5aikziun',
};

function generatePageview(index) {
  return {
    siteId: TEST_CONFIG.siteId,
    pathname: `/quick-perf/${index}`,
    hostname: 'localhost',
    referrer: index % 3 === 0 ? 'https://google.com' : null,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0.0.0',
    visitorId: `quick-visitor-${index % 20}`,
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
      status: response.status,
      duration: Date.now() - start,
      error: !response.ok
    };
  } catch (error) {
    return { success: false, error: true, duration: Date.now() - start };
  }
}

function calculatePercentile(sortedArray, percentile) {
  const index = Math.floor(sortedArray.length * (percentile / 100));
  return sortedArray[Math.min(index, sortedArray.length - 1)];
}

// Test 1: Base Load (reduced: 100 req/s for 10 seconds)
async function baseLoadTest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚡ TEST 1: BASE LOAD (100 req/s for 10 seconds)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const results = [];
  const startTime = Date.now();
  
  // Send 10 batches of 100 requests
  for (let batch = 0; batch < 10; batch++) {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(sendRequest(batch * 100 + i));
    }
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    const successful = results.filter(r => r.success).length;
    console.log(`📊 Batch ${batch + 1}/10 | Sent: ${results.length} | Success: ${successful}`);
    
    // Wait 1 second between batches
    if (batch < 9) await new Promise(r => setTimeout(r, 1000));
  }
  
  return analyzeResults(results, 'BASE LOAD', { avgTarget: 100, p95Target: 150, errorTarget: 1 });
}

// Test 2: Burst (reduced: 200 req/s for 5 seconds)
async function burstTest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💥 TEST 2: BURST (200 req/s for 5 seconds)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const results = [];
  
  // Send 5 batches of 200 requests rapidly
  for (let batch = 0; batch < 5; batch++) {
    const promises = [];
    for (let i = 0; i < 200; i++) {
      promises.push(sendRequest(batch * 200 + i));
    }
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    const successful = results.filter(r => r.success).length;
    console.log(`💥 Batch ${batch + 1}/5 | Sent: ${results.length} | Success: ${successful}`);
  }
  
  return analyzeResults(results, 'BURST', { avgTarget: 200, p95Target: 500, errorTarget: 3 });
}

// Test 3: Sustained (reduced: 50 req/s for 1 minute)
async function sustainedTest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 TEST 3: SUSTAINED (50 req/s for 1 minute)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const results = [];
  const startTime = Date.now();
  
  // Send 60 batches of 50 requests (1 per second for 60 seconds)
  for (let batch = 0; batch < 60; batch++) {
    const batchStart = Date.now();
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(sendRequest(batch * 50 + i));
    }
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    if (batch % 15 === 0 || batch === 59) {
      const successful = results.filter(r => r.success).length;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      console.log(`🔄 ${elapsed}s/60s | Sent: ${results.length} | Success: ${successful}`);
    }
    
    // Maintain 1-second interval
    const batchTime = Date.now() - batchStart;
    if (batchTime < 1000 && batch < 59) {
      await new Promise(r => setTimeout(r, 1000 - batchTime));
    }
  }
  
  return analyzeResults(results, 'SUSTAINED', { avgTarget: 100, p95Target: 150, errorTarget: 1 });
}

function analyzeResults(results, testName, targets) {
  const successful = results.filter(r => r.success);
  const errors = results.filter(r => r.error);
  const durations = successful.map(r => r.duration).sort((a, b) => a - b);
  
  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length || 0;
  const minDuration = durations[0] || 0;
  const maxDuration = durations[durations.length - 1] || 0;
  const p50 = calculatePercentile(durations, 50);
  const p95 = calculatePercentile(durations, 95);
  const p99 = calculatePercentile(durations, 99);
  const errorRate = (errors.length / results.length) * 100;
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 ${testName} RESULTS`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📤 Requests:   ${results.length}`);
  console.log(`✅ Success:    ${successful.length} (${(successful.length/results.length*100).toFixed(1)}%)`);
  console.log(`❌ Errors:     ${errors.length} (${errorRate.toFixed(2)}%)`);
  console.log(``);
  console.log(`⚡ Latency:`);
  console.log(`   Avg:  ${avgDuration.toFixed(2)}ms (target: <${targets.avgTarget}ms)`);
  console.log(`   P95:  ${p95}ms (target: <${targets.p95Target}ms)`);
  console.log(`   P99:  ${p99}ms`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  const passedAvg = avgDuration < targets.avgTarget;
  const passedP95 = p95 < targets.p95Target;
  const passedError = errorRate < targets.errorTarget;
  const passed = passedAvg && passedP95 && passedError;
  
  console.log(`\n✅ CRITERIA:`);
  console.log(`   Avg < ${targets.avgTarget}ms:     ${passedAvg ? '✅' : '❌'}`);
  console.log(`   P95 < ${targets.p95Target}ms:        ${passedP95 ? '✅' : '❌'}`);
  console.log(`   Error < ${targets.errorTarget}%:      ${passedError ? '✅' : '❌'}`);
  console.log(`\n🎯 RESULT: ${passed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
  return passed;
}

// Main
async function main() {
  console.log('⚡ QUICK PERFORMANCE TESTS (2 minutes total)\n');
  
  const results = {};
  results.baseLoad = await baseLoadTest();
  await new Promise(r => setTimeout(r, 3000));
  
  results.burst = await burstTest();
  await new Promise(r => setTimeout(r, 3000));
  
  results.sustained = await sustainedTest();
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏆 FINAL RESULTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Base Load:     ${results.baseLoad ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Burst:         ${results.burst ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Sustained:     ${results.sustained ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const allPassed = results.baseLoad && results.burst && results.sustained;
  if (allPassed) {
    console.log('🎉 ALL PERFORMANCE TESTS PASSED!\n');
    console.log('✅ Phase 5 meets all performance criteria!\n');
  }
  
  return allPassed;
}

main()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

