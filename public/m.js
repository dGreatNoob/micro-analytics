/**
 * Microlytics Tracking Script
 * Privacy-first web analytics
 * @version 1.0.0
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    apiEndpoint: '/api/track',
    debug: false
  };

  // Get site ID from script tag
  const script = document.currentScript || 
    document.querySelector('script[data-site]');
  
  if (!script) {
    console.warn('Microlytics: Script tag not found');
    return;
  }

  const siteId = script.getAttribute('data-site');
  
  if (!siteId) {
    console.warn('Microlytics: data-site attribute is required');
    return;
  }

  // Debug logging
  function log() {
    if (config.debug) {
      console.log('[Microlytics]', ...arguments);
    }
  }

  // ============================================
  // VISITOR ID GENERATION (Privacy-First)
  // ============================================
  
  /**
   * Generate a privacy-first visitor ID
   * Uses canvas fingerprint + date for daily rotation
   * No cookies, no persistent tracking
   */
  function generateVisitorId() {
    try {
      // Get date component (rotates daily)
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Generate canvas fingerprint
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        // Fallback: use screen resolution + date
        return simpleHash(`${screen.width}x${screen.height}-${date}-${navigator.userAgent.substring(0, 50)}`);
      }
      
      // Draw text with various properties to create unique fingerprint
      ctx.textBaseline = 'top';
      ctx.font = '14px "Arial"';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Microlytics 🔍', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Analytics', 4, 17);
      
      // Get canvas data
      const canvasData = canvas.toDataURL();
      const fingerprint = simpleHash(canvasData);
      
      // Combine with date for daily rotation
      return simpleHash(`${fingerprint}-${date}`);
    } catch (e) {
      // Fallback: random ID + date
      return simpleHash(`${Math.random()}-${Date.now()}-${new Date().toISOString().split('T')[0]}`);
    }
  }

  /**
   * Simple hash function for visitor ID
   */
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // ============================================
  // DATA COLLECTION
  // ============================================

  /**
   * Collect pageview data
   */
  function collectPageviewData() {
    const data = {
      // Required fields
      siteId: siteId,
      pathname: window.location.pathname,
      hostname: window.location.hostname,
      
      // Optional fields
      referrer: document.referrer || null,
      
      // User info (will be parsed server-side)
      userAgent: navigator.userAgent,
      language: navigator.language || navigator.userLanguage,
      
      // Screen info
      screenWidth: screen.width,
      screenHeight: screen.height,
      
      // Timestamp
      timestamp: new Date().toISOString(),
      
      // Visitor ID (privacy-first)
      visitorId: generateVisitorId()
    };

    log('Collected data:', data);
    return data;
  }

  // ============================================
  // DATA TRANSMISSION
  // ============================================

  /**
   * Send pageview data to server
   * Uses sendBeacon for reliability, falls back to fetch
   */
  function sendPageview(data) {
    const url = config.apiEndpoint;
    const payload = JSON.stringify(data);

    try {
      // Try sendBeacon first (most reliable)
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        const sent = navigator.sendBeacon(url, blob);
        
        if (sent) {
          log('Pageview sent via sendBeacon');
          return true;
        }
        
        log('sendBeacon failed, trying fetch...');
      }

      // Fallback to fetch
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload,
        keepalive: true // Important for page unload scenarios
      })
        .then(function(response) {
          if (response.ok) {
            log('Pageview sent via fetch');
          } else {
            log('Server responded with error:', response.status);
          }
        })
        .catch(function(error) {
          log('Fetch failed:', error);
        });

      return true;
    } catch (e) {
      log('Error sending pageview:', e);
      return false;
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize tracking
   */
  function init() {
    try {
      log('Initializing Microlytics for site:', siteId);

      // Wait for page to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageview);
      } else {
        trackPageview();
      }
    } catch (e) {
      // Fail silently - never break the host page
      if (config.debug) {
        console.error('Microlytics initialization error:', e);
      }
    }
  }

  /**
   * Track a pageview
   */
  function trackPageview() {
    try {
      const data = collectPageviewData();
      sendPageview(data);
    } catch (e) {
      // Fail silently
      if (config.debug) {
        console.error('Microlytics tracking error:', e);
      }
    }
  }

  // ============================================
  // PUBLIC API (Optional)
  // ============================================

  /**
   * Expose public API for custom event tracking
   * Will be fully implemented in Phase 5
   */
  window.microlytics = window.microlytics || {
    track: function(eventName, properties) {
      log('Custom event tracking will be available in Phase 5');
      // TODO: Phase 5 - Custom event tracking
    },
    
    // Allow manual pageview tracking
    trackPageview: trackPageview
  };

  // Start tracking
  init();
})();


