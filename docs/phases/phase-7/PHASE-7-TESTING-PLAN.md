# Phase 7: Comprehensive Testing Plan

**Status:** 🔜 Planned for Phase 7  
**Date Created:** October 12, 2025

> **Note:** Since our MVP testing covers real data and manual verification, these automated tests are planned for Phase 7 ("Advanced Dashboard Features") or regression testing.

---

## 🧪 Testing Categories

### 1. Automated Integration Tests

**Tool:** Playwright or Jest + React Testing Library

| Test ID | Test Name | Description | Expected Result |
|---------|-----------|-------------|-----------------|
| **T-7-01** | API Authentication | Call `/api/analytics/*` unauthenticated | 401 Unauthorized |
| **T-7-02** | Valid API Parameters | `/overview?siteId=valid&timeRange=30d` | 200 + correct payload |
| **T-7-03** | Invalid API Parameters | `/overview?siteId=invalid` | 404 Not Found |
| **T-7-04** | Dashboard Performance | Measure load time | < 1 second |
| **T-7-05** | Error State Rendering | Force API failure | Error UI renders |
| **T-7-06** | Empty State Rendering | Site with no pageviews | Empty UI renders |
| **T-7-07** | Site Switching | Change site selector | All cards refresh correctly |
| **T-7-08** | Time Range Filtering | Switch 7d→30d→90d | Data filters correctly |
| **T-7-09** | Real-time Updates | Wait 60 seconds | Dashboard auto-refreshes |
| **T-7-10** | CSV Export | Click export button | CSV file downloads |
| **T-7-11** | Charts Rendering | Load overview page | Time series chart displays |
| **T-7-12** | Concurrent Users | 10 users browse simultaneously | No slowdown |

**Implementation:**
```typescript
// Example: Test dashboard page
import { test, expect } from '@playwright/test';

test('dashboard loads and displays real data', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/auth/signin');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  
  // Navigate to dashboard
  await page.goto('http://localhost:3000/dashboard');
  
  // Wait for data to load
  await page.waitForSelector('[data-testid="total-pageviews"]');
  
  // Verify real data
  const pageviews = await page.textContent('[data-testid="total-pageviews"]');
  expect(parseInt(pageviews.replace(/,/g, ''))).toBeGreaterThan(0);
  
  // Verify performance
  const loadTime = await page.evaluate(() => performance.timing.loadEventEnd - performance.timing.navigationStart);
  expect(loadTime).toBeLessThan(1000);
});

test('time range selector filters data', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  
  // Get initial pageview count
  const initialCount = await page.textContent('[data-testid="total-pageviews"]');
  
  // Switch to 30d
  await page.click('button:has-text("30 Days")');
  await page.waitForTimeout(500); // Wait for API call
  
  // Verify count changed
  const newCount = await page.textContent('[data-testid="total-pageviews"]');
  expect(newCount).not.toBe(initialCount);
});
```

---

### 2. Concurrent Load Test for Dashboard APIs

**Goal:** Verify combined API throughput across all analytics endpoints

**Test Scenario:**
- Simulate 10-20 concurrent users browsing the dashboard
- Each user makes multiple API calls (overview + pages + referrers + devices)
- Target: ~100 req/s total across all endpoints
- Ensure stability during multiple UI fetches per user

**Implementation:**
```javascript
// concurrent-dashboard-test.js
const axios = require('axios');

async function simulateUser(userId, siteId, sessionToken) {
  const baseUrl = 'http://localhost:3000';
  const headers = {
    'Cookie': `next-auth.session-token=${sessionToken}`
  };
  
  const requests = [
    axios.get(`${baseUrl}/api/analytics/overview?siteId=${siteId}&timeRange=7d`, { headers }),
    axios.get(`${baseUrl}/api/analytics/pages?siteId=${siteId}&timeRange=7d`, { headers }),
    axios.get(`${baseUrl}/api/analytics/referrers?siteId=${siteId}&timeRange=7d`, { headers }),
    axios.get(`${baseUrl}/api/analytics/devices?siteId=${siteId}&timeRange=7d`, { headers }),
  ];
  
  const start = Date.now();
  await Promise.all(requests);
  const duration = Date.now() - start;
  
  console.log(`User ${userId}: ${requests.length} requests in ${duration}ms`);
  return duration;
}

async function runConcurrentTest() {
  const numUsers = 10;
  const siteId = 'your-test-site-id';
  const sessionToken = 'your-session-token';
  
  console.log(`🧪 Testing ${numUsers} concurrent users...`);
  
  const userPromises = Array.from({ length: numUsers }, (_, i) =>
    simulateUser(i + 1, siteId, sessionToken)
  );
  
  const durations = await Promise.all(userPromises);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const maxDuration = Math.max(...durations);
  
  console.log(`\n📊 Results:`);
  console.log(`  Average: ${avgDuration.toFixed(0)}ms`);
  console.log(`  Max: ${maxDuration}ms`);
  console.log(`  Target: < 2000ms`);
  console.log(`  Status: ${maxDuration < 2000 ? '✅ PASS' : '❌ FAIL'}`);
}

runConcurrentTest();
```

**Success Criteria:**
- ✅ Average response time < 1000ms per user
- ✅ Max response time < 2000ms
- ✅ No 500 errors
- ✅ No timeout errors
- ✅ Database connections stable

---

### 3. Edge-Case Tests

| Test Case | Description | Setup | Expected Result |
|-----------|-------------|-------|-----------------|
| **Empty Site** | Site with 0 pageviews | Create new site, don't install script | Empty state displays with setup guidance |
| **Large Dataset** | Site with >100K pageviews | Generate test data or use production site | Pagination works, no performance degradation |
| **Invalid Site ID** | Access analytics for non-existent site | Use random UUID in URL | Error state: "Site not found" |
| **Unauthorized Access** | View another user's site | Use different user's site ID | 404 or redirect to own sites |
| **Network Timeout** | Simulate slow API | Add artificial delay to API | Loading state → Error state with retry |
| **Malformed Data** | Corrupt API response | Mock broken API response | Error boundary catches, shows error UI |
| **No Sites** | User with zero sites | New user account | Empty state with "Create site" CTA |
| **Rate Limit Hit** | Exceed API rate limits | Make 1000+ requests quickly | 429 Too Many Requests, clear message |

**Implementation:**
```typescript
// Test: Empty site shows empty state
test('empty site shows helpful empty state', async ({ page }) => {
  await page.goto('/dashboard?siteId=site-with-no-data');
  
  await expect(page.locator('text=No data available')).toBeVisible();
  await expect(page.locator('text=Make sure your tracking script is installed')).toBeVisible();
  await expect(page.locator('a:has-text("View Setup Guide")')).toBeVisible();
});

// Test: Large dataset performance
test('large dataset loads without slowdown', async ({ page }) => {
  // Assuming test site has 100K+ pageviews
  const start = Date.now();
  
  await page.goto('/dashboard?siteId=large-site-id');
  await page.waitForSelector('[data-testid="total-pageviews"]');
  
  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(2000); // 2 seconds max
});
```

---

### 4. Regression Checklist

**Before Phase 7 Development:**

| Category | Test | Status |
|----------|------|--------|
| **API Schema** | No breaking changes to `/api/analytics/*` responses | ⏳ |
| **Component Snapshots** | UI components match previous snapshots | ⏳ |
| **Accessibility** | ARIA roles present on interactive elements | ⏳ |
| **Keyboard Nav** | Tab navigation works through dashboard | ⏳ |
| **Cross-Browser** | Chrome, Safari, Firefox all render correctly | ⏳ |
| **Mobile Responsive** | Dashboard works on mobile viewports | ⏳ |
| **Auth Flow** | Login → Dashboard still works | ⏳ |
| **Tracking** | `m.js` still sends pageviews | ⏳ |
| **Site Management** | Create/edit/delete still works | ⏳ |
| **API Performance** | Response times haven't regressed | ⏳ |

**Tools:**
- **Accessibility:** `axe-core` or Lighthouse
- **Component Snapshots:** Jest snapshots
- **Cross-browser:** BrowserStack or manual testing
- **Mobile:** Chrome DevTools device emulation

---

### 5. Performance Benchmarks

**Current Baselines (Phase 6):**
- Dashboard load: 200-400ms
- API responses: 105-135ms
- Total pageviews: 10,827

**Phase 7 Targets:**
- Dashboard load: < 500ms (with charts)
- API responses: < 150ms
- Chart rendering: < 500ms
- Export generation: < 3 seconds
- Real-time refresh: Every 60 seconds without blocking UI

**How to Measure:**
```javascript
// In browser DevTools console
performance.timing.loadEventEnd - performance.timing.navigationStart
// Should be < 500ms

// Or use Lighthouse
npx lighthouse http://localhost:3000/dashboard --view
// Target: Performance score 95+
```

---

### 6. Accessibility Checklist

| Item | Requirement | How to Test |
|------|-------------|-------------|
| **Keyboard Nav** | All interactive elements accessible via Tab | Press Tab repeatedly, verify focus |
| **ARIA Labels** | Buttons/links have descriptive labels | Check with screen reader or axe DevTools |
| **Color Contrast** | Text readable (WCAG AA compliant) | Run Lighthouse or axe |
| **Focus Indicators** | Visible focus outline on all elements | Tab through page, verify visible focus |
| **Alt Text** | Images have descriptive alt attributes | Check image tags |
| **Form Labels** | All inputs have associated labels | Verify label/input relationships |
| **Error Messages** | Errors announced to screen readers | Test with screen reader |

**Tools:**
- **axe DevTools** (Chrome extension)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (Chrome DevTools)
- **NVDA** or **VoiceOver** (screen readers)

---

## 📋 Test Documentation Template

When implementing tests in Phase 7, create `PHASE-7-TEST-RESULTS.md` with:

```markdown
# Phase 7: Test Results

## Integration Tests

| Test ID | Status | Duration | Notes |
|---------|--------|----------|-------|
| T-7-01 | ✅ PASS | 1.2s | Auth check working |
| T-7-02 | ✅ PASS | 0.8s | Valid params accepted |
| ... | ... | ... | ... |

## Load Tests

- Concurrent users: 10
- Total requests: 400 (40 per user)
- Average response: 120ms
- Max response: 245ms
- Error rate: 0%
- Status: ✅ PASS

## Edge Cases

- Empty site: ✅ PASS
- Large dataset (100K views): ✅ PASS
- Invalid site ID: ✅ PASS
- Network timeout: ✅ PASS

## Accessibility

- Lighthouse score: 98/100
- axe violations: 0
- Keyboard navigation: ✅ Working
- Screen reader: ✅ Compatible

## Regression

- API schema: ✅ No breaking changes
- Component snapshots: ✅ All match
- Cross-browser: ✅ Chrome, Safari, Firefox
- Mobile: ✅ Responsive

## Overall: ✅ ALL TESTS PASSING
```

---

## 🚀 Implementation Priority

**High Priority (MVP-blocking):**
1. Integration tests for critical user flows
2. Performance benchmarks (dashboard load time)
3. Cross-browser testing (Chrome, Safari, Firefox)
4. Basic accessibility (keyboard nav, ARIA)

**Medium Priority (Nice-to-have):**
5. Concurrent load tests
6. Edge-case tests
7. Regression suite
8. Advanced accessibility

**Low Priority (Post-MVP):**
9. Snapshot tests
10. Visual regression tests
11. End-to-end user journey tests
12. Chaos engineering tests

---

## 📚 Recommended Tools

### For Integration Testing:
- **Playwright** - Modern, fast, multi-browser
- **Jest + React Testing Library** - Component-level tests
- **Vitest** - Fast unit tests

### For Load Testing:
- **autocannon** - HTTP load testing
- **k6** - Comprehensive load testing
- **Artillery** - Scenario-based load tests

### For Accessibility:
- **axe-core** - Automated a11y testing
- **pa11y** - CLI accessibility testing
- **Lighthouse CI** - Continuous accessibility monitoring

### For Monitoring:
- **Sentry** - Error tracking
- **Vercel Analytics** - Performance monitoring
- **LogRocket** - Session replay

---

## ✅ What's Already Tested (Manual)

**Phase 6 Manual Testing Complete:**
- ✅ Dashboard loads with real data (10,827 pageviews)
- ✅ Site selector switches between sites
- ✅ Time range selector filters data (7d/30d/90d)
- ✅ All 4 pages display correctly
- ✅ Loading states appear briefly during fetch
- ✅ Error handling works (tested with invalid site ID)
- ✅ Empty states display when no data
- ✅ Tracking script still works (verified in terminal)
- ✅ Performance meets targets (<1s load, <200ms APIs)

**What Needs Automation:**
- Regression testing (ensure nothing breaks in future)
- Load testing (concurrent users)
- Edge cases (extreme scenarios)
- Cross-browser compatibility
- Accessibility compliance

---

## 🎯 Success Criteria for Phase 7 Testing

Phase 7 testing is complete when:
- [ ] All 12 integration tests passing
- [ ] Load test supports 10+ concurrent users
- [ ] All edge cases handled gracefully
- [ ] Regression suite prevents breakage
- [ ] Accessibility score > 95
- [ ] Cross-browser compatibility verified
- [ ] Documentation updated with results

---

**Reference:** See `docs/planning/ROADMAP_V2.md` Phase 7 section for complete details.

🧪 **Ready to build a production-grade testing suite!**

