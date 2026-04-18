// Background service worker - Handles API communication
'use strict';

// API Configuration
const API_BASE_URL = 'https://dsa-sync-backend.onrender.com/api';


console.log(`[DSA Sync] API URL: ${API_BASE_URL}`);
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Keep service worker alive with alarms (more reliable than setInterval)
chrome.alarms.create('keepalive', { periodInMinutes: 0.5 }); // Every 30 seconds

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepalive') {
    console.log('[DSA Sync] Service worker keepalive ping');
    // Ping backend to keep it alive too
    fetch(`${API_BASE_URL.replace('/api', '')}/keepalive`)
      .then(() => console.log('[DSA Sync] Backend keepalive successful'))
      .catch(() => {}); // Ignore errors
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SUBMISSION_DETECTED') {
    handleSubmission(message.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => {
        console.error('[DSA Sync] Submission failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Keep channel open for async response
    return true;
  }
  
  // Ping to check if worker is alive
  if (message.type === 'PING') {
    sendResponse({ alive: true });
    return true;
  }
});

// Handle submission
async function handleSubmission(data) {
  try {
    // Get JWT from storage
    const { jwt } = await chrome.storage.local.get('jwt');
    
    if (!jwt) {
      throw new Error('Not authenticated. Please login first.');
    }

    // Submit to backend
    const result = await submitWithRetry(data, jwt);
    
    // Update local stats
    await updateLocalStats();
    
    return result;
  } catch (error) {
    console.error('[DSA Sync] Error:', error);
    throw error;
  }
}

// Submit with retry logic
async function submitWithRetry(data, jwt, retryCount = 0) {
  try {
    const response = await fetch(`${API_BASE_URL}/submission/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let detailedError = `HTTP ${response.status}`;
      
      if (typeof errorData.error === 'object' && errorData.error !== null) {
        detailedError = errorData.error.message || JSON.stringify(errorData.error);
      } else if (typeof errorData.error === 'string') {
        detailedError = errorData.error;
      } else if (errorData.message) {
        detailedError = errorData.message;
      }
      
      // Do not retry client errors (400, 401, 403) or known decryption issues
      if (response.status >= 400 && response.status < 500) {
        throw new Error(detailedError);
      }
      
      throw new Error(detailedError);
    }

    return await response.json();
  } catch (error) {
    // Retry on failure if it's a network error or 5xx server error
    if (retryCount < MAX_RETRIES && !error.message.includes('40')) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`[DSA Sync] Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms`);
      
      await sleep(delay);
      return submitWithRetry(data, jwt, retryCount + 1);
    }
    
    // Log the EXACT error trace to the extension's service worker console
    console.error(`[DSA Sync] CRITICAL SUBMISSION ERROR: ${error.message}`);
    throw error;
  }
}

// Update local stats cache
async function updateLocalStats() {
  try {
    const { jwt } = await chrome.storage.local.get('jwt');
    if (!jwt) return;

    const response = await fetch(`${API_BASE_URL}/stats/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (response.ok) {
      const stats = await response.json();
      await chrome.storage.local.set({ stats });
    }
  } catch (error) {
    console.error('[DSA Sync] Stats update failed:', error);
  }
}

// Utility: Sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[DSA Sync] Extension installed');
    // Initialize storage
    chrome.storage.local.set({
      stats: {
        totalSolved: 0,
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0,
      },
    });
  }
});
