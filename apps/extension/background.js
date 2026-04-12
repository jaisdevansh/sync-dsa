// Background service worker - Handles API communication
'use strict';

const API_BASE_URL = 'http://localhost:3000/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

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
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Retry on failure
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`[DSA Sync] Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms`);
      
      await sleep(delay);
      return submitWithRetry(data, jwt, retryCount + 1);
    }
    
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
