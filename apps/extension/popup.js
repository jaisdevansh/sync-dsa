// Popup script - UI logic
'use strict';

const API_BASE_URL = 'http://localhost:3000/api';
const DASHBOARD_URL = 'http://localhost:3001/dashboard';
const GITHUB_CLIENT_ID = 'Ov23lixTaTeICwY4oD9L'; // ✅ Configured!

// DOM elements
const elements = {
  statusText: document.getElementById('statusText'),
  totalSolved: document.getElementById('totalSolved'),
  streak: document.getElementById('streak'),
  statsCard: document.getElementById('statsCard'),
  connectBtn: document.getElementById('connectBtn'),
  dashboardBtn: document.getElementById('dashboardBtn'),
};

// Initialize popup
async function init() {
  try {
    const { jwt, stats } = await chrome.storage.local.get(['jwt', 'stats']);
    
    if (jwt) {
      // User is authenticated
      await updateAuthenticatedUI(jwt, stats);
    } else {
      // User not authenticated
      updateUnauthenticatedUI();
    }
  } catch (error) {
    console.error('[DSA Sync] Init error:', error);
    showError('Failed to load data');
  }
}

// Update UI for authenticated user
async function updateAuthenticatedUI(jwt, cachedStats) {
  elements.statusText.textContent = 'Connected';
  elements.statusText.style.color = '#10b981';
  
  // Change icon to checkmark
  const statusIcon = document.querySelector('.status-icon');
  if (statusIcon) {
    statusIcon.textContent = '✓';
    statusIcon.style.background = 'rgba(34, 197, 94, 0.12)';
  }
  
  elements.connectBtn.textContent = 'RECONNECT';
  elements.connectBtn.classList.remove('btn-primary');
  elements.connectBtn.classList.add('btn-secondary');

  // Show stats
  if (cachedStats) {
    displayStats(cachedStats);
  }

  // Fetch fresh stats
  try {
    const response = await fetch(`${API_BASE_URL}/stats/me`, {
      headers: { 'Authorization': `Bearer ${jwt}` },
    });

    if (response.ok) {
      const freshStats = await response.json();
      await chrome.storage.local.set({ stats: freshStats });
      displayStats(freshStats);
    }
  } catch (error) {
    console.error('[DSA Sync] Stats fetch error:', error);
  }
}

// Update UI for unauthenticated user
function updateUnauthenticatedUI() {
  elements.statusText.textContent = 'Not connected';
  elements.statusText.style.color = '#6b7280';
  elements.statsCard.classList.add('hidden');
  elements.dashboardBtn.classList.add('hidden');
}

// Display stats
function displayStats(stats) {
  if (!stats || !stats.stats) return;

  const { totalSolved, streak } = stats.stats;
  
  elements.totalSolved.textContent = totalSolved || 0;
  elements.streak.textContent = streak || 0;
  elements.statsCard.classList.remove('hidden');

  // Show dashboard button if solved >= 5
  if (totalSolved >= 5) {
    elements.dashboardBtn.classList.remove('hidden');
  }
}

// Handle GitHub connection
elements.connectBtn.addEventListener('click', async () => {
  try {
    // Open GitHub OAuth in new tab
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo&redirect_uri=http://localhost:3000/api/auth/github/callback`;
    
    const authWindow = window.open(authUrl, 'GitHub Auth', 'width=600,height=700');
    
    // Listen for messages from the auth window
    const messageListener = async (event) => {
      // Security check
      if (event.origin !== 'http://localhost:3000') return;
      
      if (event.data.type === 'DSA_SYNC_AUTH_SUCCESS') {
        window.removeEventListener('message', messageListener);
        
        if (event.data.jwt) {
          await chrome.storage.local.set({ 
            jwt: event.data.jwt,
            username: event.data.username 
          });
          await init(); // Refresh UI
          showSuccess('Connected successfully!');
          
          // Close auth window if still open
          if (authWindow && !authWindow.closed) {
            authWindow.close();
          }
        }
      }
    };
    
    window.addEventListener('message', messageListener);
    
    // Cleanup after 2 minutes
    setTimeout(() => {
      window.removeEventListener('message', messageListener);
    }, 120000);
    
  } catch (error) {
    console.error('[DSA Sync] Connect error:', error);
    showError('Connection failed');
  }
});

// Handle OAuth callback
async function handleOAuthCallback(code) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/github/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    
    if (data.jwt) {
      await chrome.storage.local.set({ jwt: data.jwt });
      await init(); // Refresh UI
      showSuccess('Connected successfully!');
    }
  } catch (error) {
    console.error('[DSA Sync] OAuth error:', error);
    showError('Authentication failed');
  }
}

// Handle dashboard button
elements.dashboardBtn.addEventListener('click', async () => {
  const { jwt } = await chrome.storage.local.get('jwt');
  if (jwt) {
    chrome.tabs.create({ url: `${DASHBOARD_URL}?jwt=${jwt}` });
  }
});

// Show success message
function showSuccess(message) {
  elements.statusText.textContent = message;
  elements.statusText.style.color = '#10b981';
}

// Show error message
function showError(message) {
  elements.statusText.textContent = message;
  elements.statusText.style.color = '#ef4444';
}

// Initialize on load
init();
