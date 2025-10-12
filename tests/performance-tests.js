/**
 * Performance & Load Tests for /api/track
 * 
 * Tests:
 * 1. Base Load: 100 req/s for 1 minute (avg <100ms, P95 <150ms, error <1%)
 * 2. Burst Test: 500 req/s for 5 seconds (error <3%, recovers)
 * 3. Sustained: 50 req/s for 5 minutes (stability, no leaks)
 */

const TEST_CONFIG = {
  endpoint: 'http://localhost:3000/api/track',
  siteId: 'iam2ttdx8jgnvfpg5aikziun',
};

// Generate test data
function generatePageview(index) {
  return {
    siteId: TEST_CONFIG.siteId,
    pathname: `/perf-test/${index}`,
    hostname: 'localhost',
    referrer: index % 3 === 0 ? 'https://google.com' : null,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0.0.0',
    visitorId: `perf-visitor-${index % 50}`,
    timestamp: new Date().toISOString()
  };
}

// Send request and measure
async function sendRequest(index) {
  const start = Date.now();
  try {
    const response = await fetch(TEST_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generatePageview(index))
    });
    
    const duration = Date.now() - start;
    return {
      success: response.ok,
      status: response.status,
      duration,
      error: !response.ok
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      duration: Date.now() - start
    };
  }
}

// Calculate percentiles
function calculatePercentile(sortedArray, percentile) {
  const index = Math.floor(sortedArray.length * (percentile / 100));
  return sortedArray[index];
}

// Test 1: Base Load - 100 req/s for 1 minute
async function baseLoadTest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚡ TEST 1: BASE LOAD (100 req/s for 1 minute)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const targetRate = 100; // req/s
  const durationSec = 60;
  const totalRequests = targetRate * durationSec; // 6000 requests
  const batchSize = 100; // Send 100 at a time
  const batchDelay = 1000; // 1 second between batches = 100 req/s
  
  console.log(`📊 Sending ${totalRequests} requests (${targetRate} req/s)`);
  console.log(`⏱️  Duration: ${durationSec} seconds`);
  console.log(`🔀 Batch size: ${batchSize} concurrent\n`);
  
  const results = [];
  const startTime = Date.now();
  
  for (let batch = 0; batch < durationSec; batch++) {
    const batchStart = Date.now();
    
    // Send batch concurrently
    const promises = [];
    for (let i = 0; i < batchSize; i++) {
      const index = batch * batchSize + i;
      promises.push(sendRequest(index));
    }
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Progress
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const progress = ((batch + 1) / durationSec * 100).toFixed(1);
    const successful = results.filter(r => r.success).length;
    const errors = results.filter(r => r.error).length;
    
    if ((batch + 1) % 10 === 0 || batch === 0) {
      console.log(`📊 Batch ${batch + 1}/${durationSec} | Progress: ${progress}% | Success: ${successful} | Errors: ${errors}`);
    }
    
    // Maintain rate (wait rest of second)
    const batchTime = Date.now() - batchStart;
    if (batchTime < batchDelay) {
      await new Promise(resolve => setTimeout(resolve, batchDelay - batchTime));
    }
  }
  
  return analyzeResults(results, 'BASE LOAD', { avgTarget: 100, p95Target: 150, errorTarget: 1 });
}

// Test 2: Burst Test - 500 req/s for 5 seconds
async function burstTest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💥 TEST 2: BURST LOAD (500 req/s for 5 seconds)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const totalRequests = 2500; // 500 req/s * 5 seconds
  const concurrency = 100; // High concurrency for burst
  
  console.log(`📊 Sending ${totalRequests} requests`);
  console.log(`🔀 Concurrency: ${concurrency} parallel\n`);
  
  const results = [];
  const startTime = Date.now();
  
  // Send in batches
  for (let batch = 0; batch * concurrency < totalRequests; batch++) {
    const promises = [];
    const batchStart = batch * concurrency;
    const batchEnd = Math.min((batch + 1) * concurrency, totalRequests);
    
    for (let i = batchStart; i < batchEnd; i++) {
      promises.push(sendRequest(i));
    }
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    if ((batch + 1) % 5 === 0) {
      const successful = results.filter(r => r.success).length;
      const errors = results.filter(r => r.error).length;
      console.log(`💥 Batch ${batch + 1} | Sent: ${results.length} | Success: ${successful} | Errors: ${errors}`);
    }
  }
  
  return analyzeResults(results, 'BURST', { avgTarget: 200, p95Target: 500, errorTarget: 3 });
}

// Test 3: Sustained Stability - 50 req/s for 5 minutes
async function sustainedStabilityTest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 TEST 3: SUSTAINED STABILITY (50 req/s for 5 minutes)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const targetRate = 50;
  const durationSec = 300; // 5 minutes
  const totalRequests = targetRate * durationSec; // 15000 requests
  const batchSize = 50;
  const batchDelay = 1000;
  
  console.log(`📊 Sending ${totalRequests} requests (${targetRate} req/s)`);
  console.log(`⏱️  Duration: ${durationSec} seconds (5 minutes)`);
  console.log(`🔀 Batch size: ${batchSize} concurrent`);
  console.log(`⚠️  This will take 5 minutes...\n`);
  
  const results = [];
  const startTime = Date.now();
  const memorySnapshots = [];
  
  for (let batch = 0; batch < durationSec; batch++) {
    const batchStart = Date.now();
    
    // Send batch
    const promises = [];
    for (let i = 0; i < batchSize; i++) {
      const index = batch * batchSize + i;
      promises.push(sendRequest(index));
    }
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Memory snapshot every 30 seconds
    if (batch % 30 === 0) {
      const mem = process.memoryUsage();
      memorySnapshots.push({
        time: batch,
        heapUsed: mem.heapUsed / 1024 / 1024, // MB
        rss: mem.rss / 1024 / 1024 // MB
      });
    }
    
    // Progress every 30 seconds
    if (batch % 30 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const successful = results.filter(r => r.success).length;
      const errors = results.filter(r => r.error).length;
      const avgLatency = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
      
      console.log(`🔄 Time: ${elapsed}s/${durationSec}s | Sent: ${results.length} | Success: ${successful} | Errors: ${errors} | Avg: ${avgLatency.toFixed(1)}ms`);
    }
    
    // Maintain rate
    const batchTime = Date.now() - batchStart;
    if (batchTime < batchDelay) {
      await new Promise(resolve => setTimeout(resolve, batchDelay - batchTime));
    }
  }
  
  // Check for memory leaks
  console.log('\n📊 Memory Stability:');
  memorySnapshots.forEach(snap => {
    console.log(`   ${snap.time}s: Heap ${snap.heapUsed.toFixed(1)}MB | RSS ${snap.rss.toFixed(1)}MB`);
  });
  
  const memGrowth = memorySnapshots[memorySnapshots.length - 1].heapUsed - memorySnapshots[0].heapUsed;
  console.log(`   Growth: ${memGrowth > 0 ? '+' : ''}${memGrowth.toFixed(1)}MB`);
  
  if (memGrowth < 50) {
    console.log('   ✅ No significant memory leak detected\n');
  } else {
    console.log('   ⚠️  Memory growth detected, may indicate leak\n');
  }
  
  return analyzeResults(results, 'SUSTAINED', { avgTarget: 100, p95Target: 150, errorTarget: 1 });
}

// Analyze test results
function analyzeResults(results, testName, targets) {
  const totalTime = results.length > 0 ? 
    (Math.max(...results.map((_, i) => i)) / results.length) : 0;
  
  const successful = results.filter(r => r.success);
  const errors = results.filter(r => r.error);
  const durations = successful.map(r => r.duration).sort((a, b) => a - b);
  
  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const minDuration = durations[0];
  const maxDuration = durations[durations.length - 1];
  const p50 = calculatePercentile(durations, 50);
  const p95 = calculatePercentile(durations, 95);
  const p99 = calculatePercentile(durations, 99);
  
  const errorRate = (errors.length / results.length) * 100;
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 ${testName} TEST RESULTS`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📤 Total Requests:  ${results.length}`);
  console.log(`✅ Successful:      ${successful.length} (${(successful.length/results.length*100).toFixed(1)}%)`);
  console.log(`❌ Errors:          ${errors.length} (${errorRate.toFixed(2)}%)`);
  console.log(``);
  console.log(`⚡ Response Times:`);
  console.log(`   Average:         ${avgDuration.toFixed(2)}ms`);
  console.log(`   Min:             ${minDuration}ms`);
  console.log(`   Max:             ${maxDuration}ms`);
  console.log(`   P50:             ${p50}ms`);
  console.log(`   P95:             ${p95}ms`);
  console.log(`   P99:             ${p99}ms`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  // Check against targets
  const passedAvg = avgDuration < targets.avgTarget;
  const passedP95 = p95 < targets.p95Target;
  const passedError = errorRate < targets.errorTarget;
  
  console.log(`\n✅ PASS CRITERIA:`);
  console.log(`   Average < ${targets.avgTarget}ms:     ${passedAvg ? '✅' : '❌'} (${avgDuration.toFixed(2)}ms)`);
  console.log(`   P95 < ${targets.p95Target}ms:        ${passedP95 ? '✅' : '❌'} (${p95}ms)`);
  console.log(`   Error rate < ${targets.errorTarget}%:      ${passedError ? '✅' : '❌'} (${errorRate.toFixed(2)}%)`);
  
  const passed = passedAvg && passedP95 && passedError;
  console.log(`\n🎯 ${testName} TEST: ${passed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
  return passed;
}

// Main test runner
async function runPerformanceTests() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚡ PERFORMANCE & LOAD TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('This will take approximately 6-7 minutes total.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const results = {
    baseLoad: false,
    burst: false,
    sustained: false
  };
  
  // Run tests
  console.log('Starting in 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  results.baseLoad = await baseLoadTest();
  console.log('Waiting 5 seconds before burst test...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  results.burst = await burstTest();
  console.log('Waiting 5 seconds before sustained test...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  results.sustained = await sustainedStabilityTest();
  
  // Final summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏆 PERFORMANCE TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Base Load (100 req/s):     ${results.baseLoad ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Burst (500 req/s):         ${results.burst ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Sustained (50 req/s 5min): ${results.sustained ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const allPassed = results.baseLoad && results.burst && results.sustained;
  console.log(`\n🎯 OVERALL: ${allPassed ? '✅ ALL TESTS PASSED!' : '⚠️  Some tests failed'}\n`);
  
  return allPassed;
}

// Execute
console.log('\n⚠️  WARNING: This test suite will send ~23,500 requests');
console.log('and take approximately 6-7 minutes to complete.');
console.log('\nPress Ctrl+C to cancel or wait to continue...\n');

setTimeout(() => {
  runPerformanceTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test error:', error);
      process.exit(1);
    });
}, 3000);

