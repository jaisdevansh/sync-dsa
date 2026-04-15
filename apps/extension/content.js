// Content script - Detects submissions on LeetCode and GeeksforGeeks
(function() {
  'use strict';

  // State management
  let lastSubmission = null;
  let debounceTimer = null;
  let observer = null;
  
  const DEBOUNCE_DELAY = 2000; // 2 seconds
  const PLATFORM = detectPlatform();

  // Platform detection
  function detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('leetcode.com')) return 'leetcode';
    if (hostname.includes('geeksforgeeks.org')) return 'gfg';
    return null;
  }

  // Platform-specific extractors
  const extractors = {
    leetcode: {
      isAccepted: () => {
        // Multiple ways to detect accepted
        const result = document.querySelector('[data-e2e-locator="submission-result"]');
        if (result && result.textContent.toLowerCase().includes('accepted')) return true;
        
        // Alternative: Check for success icon
        const successIcon = document.querySelector('[class*="success"]');
        if (successIcon && successIcon.textContent.toLowerCase().includes('accepted')) return true;
        
        // Alternative: Check page text
        const pageText = document.body.textContent.toLowerCase();
        return pageText.includes('accepted') && pageText.includes('runtime');
      },
      
      getTitle: () => {
        // Try multiple selectors first
        let titleEl = document.querySelector('[data-cy="question-title"]');
        if (titleEl && titleEl.textContent.trim()) return titleEl.textContent.trim();
        
        titleEl = document.querySelector('a[href*="/problems/"]');
        if (titleEl && titleEl.textContent.trim()) return titleEl.textContent.trim();
        
        titleEl = document.querySelector('.text-title-large');
        if (titleEl && titleEl.textContent.trim()) return titleEl.textContent.trim();
        
        titleEl = document.querySelector('div[class*="title"]');
        if (titleEl && titleEl.textContent.trim()) return titleEl.textContent.trim();
        
        // New selectors for updated LeetCode UI
        titleEl = document.querySelector('div[class*="text-title"]');
        if (titleEl && titleEl.textContent.trim()) return titleEl.textContent.trim();
        
        titleEl = document.querySelector('h1');
        if (titleEl && titleEl.textContent.trim()) return titleEl.textContent.trim();
        
        // Fallback: Get from URL (most reliable)
        const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
        if (match) {
          // Convert "two-sum" to "Two Sum"
          return match[1]
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        }
        
        return null;
      },
      
      getDifficulty: () => {
        // Try multiple selectors
        let diffEl = document.querySelector('[diff]');
        if (diffEl) {
          const diff = diffEl.getAttribute('diff').toLowerCase();
          return ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
        }
        
        diffEl = document.querySelector('[class*="difficulty"]');
        if (diffEl) {
          const text = diffEl.textContent.toLowerCase();
          if (text.includes('easy')) return 'easy';
          if (text.includes('hard')) return 'hard';
          return 'medium';
        }
        
        // Default
        return 'medium';
      },
      
      getCode: () => {
        // Try Monaco editor (most common)
        let lines = document.querySelectorAll('.view-line');
        if (lines.length > 0) {
          const code = Array.from(lines)
            .map(line => line.textContent)
            .join('\n')
            .trim();
          if (code.length > 10) return code; // Ensure it's not empty
        }
        
        // Try CodeMirror
        lines = document.querySelectorAll('.CodeMirror-line');
        if (lines.length > 0) {
          const code = Array.from(lines)
            .map(line => line.textContent)
            .join('\n')
            .trim();
          if (code.length > 10) return code;
        }
        
        // Try textarea
        const textarea = document.querySelector('textarea[class*="code"]');
        if (textarea && textarea.value.trim().length > 10) return textarea.value.trim();
        
        // Try any textarea
        const anyTextarea = document.querySelector('textarea');
        if (anyTextarea && anyTextarea.value.trim().length > 10) return anyTextarea.value.trim();
        
        // Try pre or code tags
        const codeBlock = document.querySelector('pre code') || document.querySelector('pre');
        if (codeBlock && codeBlock.textContent.trim().length > 10) return codeBlock.textContent.trim();
        
        console.warn('[DSA Sync] Could not extract code from editor');
        return null;
      },
      
      getLanguage: () => {
        // Try button text
        let langBtn = document.querySelector('[id^="headlessui-listbox-button"]');
        if (langBtn) {
          const lang = langBtn.textContent.trim().toLowerCase();
          if (lang) return lang;
        }
        
        // Try dropdown
        langBtn = document.querySelector('[class*="lang"]');
        if (langBtn) {
          const lang = langBtn.textContent.trim().toLowerCase();
          if (lang) return lang;
        }
        
        // Default
        return 'javascript';
      },
    },

    gfg: {
      isAccepted: () => {
        const result = document.querySelector('.problems_submit_result__success');
        return !!result;
      },
      
      getTitle: () => {
        const titleEl = document.querySelector('.problems_header_content__title__text') ||
                       document.querySelector('h1');
        return titleEl ? titleEl.textContent.trim() : null;
      },
      
      getDifficulty: () => {
        const diffEl = document.querySelector('.problems_header_content__title__difficulty');
        if (!diffEl) return 'medium';
        const text = diffEl.textContent.toLowerCase();
        if (text.includes('easy')) return 'easy';
        if (text.includes('hard')) return 'hard';
        return 'medium';
      },
      
      getCode: () => {
        const lines = document.querySelectorAll('.ace_line');
        if (!lines.length) return null;
        return Array.from(lines)
          .map(line => line.textContent)
          .join('\n')
          .trim();
      },
      
      getLanguage: () => {
        const langEl = document.querySelector('.problems_header_language__dropdown');
        if (!langEl) return 'cpp';
        const lang = langEl.textContent.trim().toLowerCase();
        return lang || 'cpp';
      },
    },
  };

  // Extract submission data
  function extractSubmissionData() {
    if (!PLATFORM || !extractors[PLATFORM]) {
      console.error('[DSA Sync] Unknown platform');
      return null;
    }

    const extractor = extractors[PLATFORM];

    try {
      // Check if submission was accepted
      if (!extractor.isAccepted()) {
        console.log('[DSA Sync] Not accepted, skipping');
        return null;
      }

      const title = extractor.getTitle();
      const code = extractor.getCode();

      console.log('[DSA Sync] Extraction attempt:', { 
        platform: PLATFORM,
        title: title || 'MISSING',
        titleLength: title ? title.length : 0,
        code: code ? `${code.length} chars` : 'MISSING',
        url: window.location.href
      });

      // Validate required fields
      if (!title || !code) {
        console.warn('[DSA Sync] Missing required fields - will retry on next DOM change', { 
          title: !!title, 
          code: !!code 
        });
        return null;
      }

      const data = {
        title,
        difficulty: extractor.getDifficulty(),
        code,
        language: extractor.getLanguage(),
        platform: PLATFORM,
      };

      console.log('[DSA Sync] Full data:', {
        title: data.title,
        difficulty: data.difficulty,
        language: data.language,
        codeLength: data.code.length
      });

      // Create unique key for deduplication
      const submissionKey = `${title}-${code.length}-${PLATFORM}`;
      
      // Check if this is a duplicate
      if (lastSubmission === submissionKey) {
        console.log('[DSA Sync] Duplicate submission, skipping');
        return null;
      }

      lastSubmission = submissionKey;
      return data;

    } catch (error) {
      console.error('[DSA Sync] Extraction error:', error);
      return null;
    }
  }

  // Handle submission detection
  function handleSubmission() {
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
      const data = extractSubmissionData();
      
      if (data) {
        console.log('[DSA Sync] Submission detected:', data.title);
        
        // Wake up service worker first, then send submission
        chrome.runtime.sendMessage({ type: 'PING' }, (pingResponse) => {
          if (chrome.runtime.lastError) {
            console.warn('[DSA Sync] Service worker wake-up failed:', chrome.runtime.lastError);
          } else {
            console.log('[DSA Sync] Service worker is alive');
          }
          
          // Send submission (even if ping failed, try anyway)
          setTimeout(() => {
            chrome.runtime.sendMessage(
              { type: 'SUBMISSION_DETECTED', data },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error('[DSA Sync] Message error:', chrome.runtime.lastError);
                  showToast('⚠️ Extension error - try reloading', 'error');
                  return;
                }
                
                if (response?.success) {
                  showToast('✅ Synced to GitHub!', 'success');
                } else {
                  showToast('⚠️ Sync failed', 'error');
                }
              }
            );
          }, 100);
        });
      }
    }, DEBOUNCE_DELAY);
  }

  // Show toast notification
  function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.getElementById('dsa-sync-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'dsa-sync-toast';
    toast.textContent = message;
    
    const styles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '999999',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'opacity 0.3s ease',
    };

    const colors = {
      success: { bg: '#10b981', color: '#fff' },
      error: { bg: '#ef4444', color: '#fff' },
      info: { bg: '#3b82f6', color: '#fff' },
    };

    Object.assign(toast.style, styles, {
      backgroundColor: colors[type].bg,
      color: colors[type].color,
    });

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Initialize observer
  function init() {
    if (!PLATFORM) {
      console.warn('[DSA Sync] Not on supported platform');
      return;
    }

    console.log(`[DSA Sync] Initialized on ${PLATFORM}`);

    // Observe DOM changes
    observer = new MutationObserver((mutations) => {
      // Check if any mutation contains submission result
      const hasSubmissionResult = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType !== 1) return false;
          const text = node.textContent?.toLowerCase() || '';
          return text.includes('accepted') || text.includes('success');
        });
      });

      if (hasSubmissionResult) {
        handleSubmission();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (observer) observer.disconnect();
    clearTimeout(debounceTimer);
  });

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
