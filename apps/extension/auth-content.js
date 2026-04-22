// This content script runs on the authentication success page
// It listens for a postMessage from the backend webpage containing the JWT and saves it to the extension's storage.

console.log('[DSA Sync] Auth content script injected.');

window.addEventListener('message', (event) => {
  // Ensure the message is coming from the same window
  if (event.source !== window) return;

  const data = event.data;

  // Listen for the specific message type sent by the success page
  if (data && data.type === 'DSA_SYNC_AUTH_SUCCESS') {
    if (data.jwt) {
      console.log('[DSA Sync] Received JWT from success page. Saving to extension storage...');
      
      chrome.storage.local.set({
        jwt: data.jwt,
        username: data.username,
        authInProgress: false
      }, () => {
        console.log('[DSA Sync] Authentication tokens stored successfully!');
      });
    }
  }
});
