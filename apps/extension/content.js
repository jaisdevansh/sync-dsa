// Content script - Detects submissions on LeetCode and GeeksforGeeks
(function() {
  'use strict';

  // State management
  let lastSubmission = null;
  let lastSubmissionTime = 0;
  let debounceTimer = null;
  let observer = null;
  let isProcessing = false; // Flag to prevent concurrent processing
  let submitClickedTime = 0; // Track when submit was clicked
  
  const DEBOUNCE_DELAY = 2000; // 2 seconds
  const DUPLICATE_WINDOW = 60000; // 60 seconds - ignore duplicates within this window
  const PLATFORM = detectPlatform();

  // Platform detection
  function detectPlatform() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    console.log('[DSA Sync] Checking platform:', { hostname, pathname });
    
    if (hostname.includes('leetcode.com')) {
      console.log('[DSA Sync] Platform detected: LeetCode');
      return 'leetcode';
    }
    if (hostname.includes('geeksforgeeks.org') && (pathname.includes('/problems/') || pathname.includes('/practice/'))) {
      console.log('[DSA Sync] Platform detected: GeeksforGeeks');
      return 'gfg';
    }
    if (hostname.includes('codingninjas.com') || hostname.includes('naukri.com')) {
      if (pathname.includes('/problems/') || pathname.includes('/code360/')) {
        console.log('[DSA Sync] Platform detected: CodingNinjas');
        return 'codingninjas';
      }
    }
    
    console.warn('[DSA Sync] Platform not detected:', hostname);
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
        
        // Look for the "Accepted" text in the new UI submission panel
        const submissionStatus = document.querySelector('.text-green-s.dark\\:text-dark-green-s');
        if (submissionStatus && submissionStatus.textContent.toLowerCase().includes('accepted')) return true;

        // Check for specific text that only appears on submission success
        const pageText = document.body.textContent.toLowerCase();
        if (pageText.includes('accepted') && (pageText.includes('beats') || pageText.includes('runtime'))) {
          // Ensure it's in a context of a recent submission
          const detailLink = document.querySelector('a[href*="/submissions/detail/"]');
          if (detailLink) return true;
        }

        return false;
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
      
      getCode: async () => {
        // 1. Try to extract from Monaco directly via injected script (Best way)
        const monacoData = await getMonacoData();
        if (monacoData && monacoData.code && monacoData.code.length > 50) {
          console.log('[DSA Sync] Code extracted via Monaco API');
          return monacoData.code;
        }

        // 2. Try to get the code from LeetCode's localStorage cache (Very reliable for full code)
        try {
          // Problem ID is usually in the URL or page data. Let's look for it.
          const problemIdMatch = document.body.innerHTML.match(/"questionId":"(\d+)"/) || 
                                document.body.innerHTML.match(/questionId:\s*'(\d+)'/);
          const problemId = problemIdMatch ? problemIdMatch[1] : null;
          
          if (problemId) {
            console.log('[DSA Sync] Searching localStorage for problem ID:', problemId);
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              
              // LeetCode uses keys like: 123_cpp_code_cache
              // We must avoid keys like: 123_code_cache_state or others that are not the actual code
              if (key.includes(problemId) && 
                  (key.includes('code_cache') || key.includes('code-cache')) && 
                  !key.includes('state') && 
                  !key.includes('history')) {
                
                const rawValue = localStorage.getItem(key);
                if (!rawValue) continue;

                try {
                  const parsed = JSON.parse(rawValue);
                  // Case 1: Value is an object with a 'code' property (Common)
                  if (parsed && typeof parsed === 'object' && parsed.code && parsed.code.length > 50) {
                    console.log('[DSA Sync] Found full code in localStorage (parsed object)!');
                    return parsed.code;
                  }
                  // Case 2: Value is just the string (Old/Alternative)
                  if (typeof parsed === 'string' && parsed.length > 50) {
                    console.log('[DSA Sync] Found full code in localStorage (parsed string)!');
                    return parsed;
                  }
                } catch (e) {
                  // Case 3: Value is not JSON, use raw if it's long enough
                  if (rawValue.length > 50 && !rawValue.trim().startsWith('{') && !rawValue.trim().startsWith('[')) {
                    console.log('[DSA Sync] Found full code in localStorage (raw string)!');
                    return rawValue;
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error('[DSA Sync] LocalStorage check failed:', e);
        }

        // 3. Try to find the code from the submission details panel
        // We wait a bit to ensure the panel has rendered the full code
        for (let i = 0; i < 3; i++) {
          const submissionCode = document.querySelector('code[class*="language-"]') || 
                                document.querySelector('pre code') ||
                                document.querySelector('.submission-result-code');
          if (submissionCode) {
             const clone = submissionCode.cloneNode(true);
             const lineNumbers = clone.querySelectorAll('.line-number, .lineno, .hljs-ln-numbers, [class*="line-number"], .line-index');
             lineNumbers.forEach(n => n.remove());
             
             let text = clone.textContent.trim();
             text = text.split('\n').map(line => line.replace(/^\d+\s*/, '')).join('\n').trim();
             
             if (text.length > 50) {
                console.log('[DSA Sync] Code extracted via Submission Panel scraping');
                return text;
             }
          }
          await new Promise(r => setTimeout(r, 500));
        }

        // 4. Last resort: Scrape visible lines (warning: might be partial)
        let lines = document.querySelectorAll('.view-line');
        if (lines.length > 0) {
          const code = Array.from(lines)
            .map(line => line.textContent)
            .join('\n')
            .trim();
          if (code.length > 50) {
            return code;
          }
        }

        console.warn('[DSA Sync] Could not extract full code');
        return null;
      },
      
      getLanguage: async () => {
        // Try to get from Monaco directly
        const monacoData = await getMonacoData();
        if (monacoData && monacoData.language) {
          let l = monacoData.language.toLowerCase();
          if (l === 'python3') return 'python';
          if (l === 'c++') return 'cpp';
          return l;
        }

        // Try local storage (Very reliable for LeetCode)
        try {
          const lang = window.localStorage.getItem('global_lang');
          if (lang) {
             let l = lang.toLowerCase();
             if (l === 'python3') return 'python';
             if (l === 'c++') return 'cpp';
             return l;
          }
        } catch(e) {}

        // Look for code block class in submission view
        const codeBlock = document.querySelector('code[class*="language-"]');
        if (codeBlock) {
           const match = codeBlock.className.match(/language-([a-z+]+)/);
           if (match) {
             let l = match[1].toLowerCase();
             if (l === 'python3') return 'python';
             if (l === 'c++') return 'cpp';
             return l;
           }
        }

        // Try button text
        let langBtn = document.querySelector('button[id^="headlessui-listbox-button"]');
        if (langBtn) {
          const lang = langBtn.textContent.trim().toLowerCase();
          if (lang && lang.length < 20) return lang;
        }
        
        let langFallback = document.querySelector('button[class*="lang"]');
        if (langFallback) {
          const lang = langFallback.textContent.trim().toLowerCase();
          if (lang && lang.length < 20) return lang;
        }
        
        // Default
        return 'javascript';
      },
    },

    gfg: {
      isAccepted: () => {
        console.log('[DSA Sync] Checking if GFG submission is accepted...');
        
        // Check for success panel
        const successPanel = document.querySelector('.ui.success.message');
        if (successPanel) {
          console.log('[DSA Sync] Found success panel');
          return true;
        }
        
        // Check for "Problem Solved Successfully" text
        const successText = document.body.textContent;
        if (successText.includes('Problem Solved Successfully') || 
            successText.includes('All test cases passed')) {
          console.log('[DSA Sync] Found success text');
          return true;
        }
        
        // Check old selectors
        const successResult = document.querySelector('.problems_submit_result__success');
        if (successResult) {
          console.log('[DSA Sync] Found success result element');
          return true;
        }
        
        // Check for "Correct Answer" text
        if (successText.includes('Correct Answer') || successText.includes('all test cases passed')) {
          console.log('[DSA Sync] Found correct answer text');
          return true;
        }
        
        // Check for success icon/badge
        const successIcon = document.querySelector('[class*="success"]');
        if (successIcon && successIcon.textContent.toLowerCase().includes('correct')) {
          console.log('[DSA Sync] Found success icon');
          return true;
        }
        
        console.log('[DSA Sync] No success indicators found');
        return false;
      },
      
      getTitle: () => {
        // Strategy 1: Try multiple DOM selectors
        const selectors = [
          '.problems_header_content__title__text',
          '.problem-title',
          '[class*="problem"][class*="title"]',
          'h1.problemTitle',
          'div.problemTitle',
          'h1'
        ];
        
        for (const selector of selectors) {
          const titleEl = document.querySelector(selector);
          if (titleEl) {
            const text = titleEl.textContent.trim();
            // Validate: title should be reasonable length and not contain code
            if (text && text.length > 3 && text.length < 200 && !text.includes('class ') && !text.includes('function ')) {
              console.log(`[DSA Sync] Found title via selector "${selector}":`, text);
              return text;
            }
          }
        }
        
        // Strategy 2: Get from URL (most reliable for GFG)
        const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
        if (match) {
          const urlTitle = match[1]
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          console.log('[DSA Sync] Extracted title from URL:', urlTitle);
          return urlTitle;
        }
        
        console.warn('[DSA Sync] Could not extract title');
        return null;
      },
      
      getDifficulty: () => {
        const diffEl = document.querySelector('.problems_header_content__title__difficulty') ||
                       document.querySelector('[class*="difficulty"]');
        if (!diffEl) return 'medium';
        const text = diffEl.textContent.toLowerCase();
        if (text.includes('easy')) return 'easy';
        if (text.includes('hard')) return 'hard';
        return 'medium';
      },
      
      getCode: async () => {
        // Try Ace editor
        let lines = document.querySelectorAll('.ace_line');
        if (lines.length > 0) {
          const code = Array.from(lines)
            .map(line => line.textContent)
            .join('\n')
            .trim();
          if (code.length > 10) return code;
        }
        
        // Try Monaco editor
        lines = document.querySelectorAll('.view-line');
        if (lines.length > 0) {
          const code = Array.from(lines)
            .map(line => line.textContent)
            .join('\n')
            .trim();
          if (code.length > 10) return code;
        }
        
        // Try textarea
        const textarea = document.querySelector('textarea');
        if (textarea && textarea.value.trim().length > 10) return textarea.value.trim();
        
        console.warn('[DSA Sync] Could not extract code from GFG editor');
        return null;
      },
      
      getLanguage: async () => {
        // Try language dropdown
        let langEl = document.querySelector('.problems_header_language__dropdown');
        if (langEl && langEl.textContent.trim()) {
          return langEl.textContent.trim().toLowerCase();
        }
        
        // Try button with language
        langEl = document.querySelector('button[class*="language"]');
        if (langEl && langEl.textContent.trim()) {
          return langEl.textContent.trim().toLowerCase();
        }
        
        // Try select dropdown
        const selectEl = document.querySelector('select[class*="language"]');
        if (selectEl && selectEl.value) {
          return selectEl.value.toLowerCase();
        }
        
        // Default to cpp for GFG
        return 'cpp';
      },
    },

    codingninjas: {
      isAccepted: () => {
        // Check for "Accepted" or "Correct Answer" labels
        const statusLabel = document.querySelector('.status-label.accepted') || 
                           document.querySelector('.status-correct');
        if (statusLabel) return true;

        // Check for checkmark icon
        const successIcon = document.querySelector('mat-icon.icon-check') ||
                           document.querySelector('.success-icon');
        if (successIcon) return true;

        // Check page text
        const bodyText = document.body.textContent;
        return bodyText.includes('Correct Answer') || bodyText.includes('Problem Solved Successfully');
      },

      getTitle: () => {
        let titleEl = document.querySelector('a.problem-title') || 
                     document.querySelector('.problem-name') ||
                     document.querySelector('h1');
        if (titleEl) return titleEl.textContent.trim();

        // Fallback from URL
        const match = window.location.pathname.match(/\/problems\/([^\/]+)/) ||
                      window.location.pathname.match(/\/code360\/problems\/([^\/]+)/);
        if (match) {
          return match[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        return null;
      },

      getDifficulty: () => {
        const diffEl = document.querySelector('codingninjas-difficulty-chip') || 
                       document.querySelector('.difficulty');
        if (diffEl) {
          const text = diffEl.textContent.toLowerCase();
          if (text.includes('easy')) return 'easy';
          if (text.includes('hard')) return 'hard';
          if (text.includes('moderate')) return 'medium';
        }
        return 'medium';
      },

      getCode: async () => {
        // CodingNinjas uses Monaco/Studio editor
        const lines = document.querySelectorAll('.view-lines .view-line');
        if (lines.length > 0) {
          return Array.from(lines).map(line => line.textContent).join('\n').trim();
        }

        // Try textarea fallback
        const textarea = document.querySelector('textarea.inputarea');
        if (textarea && textarea.value.length > 10) return textarea.value;

        return null;
      },

      getLanguage: async () => {
        const langEl = document.querySelector('.language-select .mat-select-value-text') ||
                       document.querySelector('.classroom-language-select .mat-select-value-text');
        if (langEl) {
          const text = langEl.textContent.trim().toLowerCase();
          if (text.includes('javascript')) return 'javascript';
          if (text.includes('python')) return 'python';
          if (text.includes('java')) return 'java';
          if (text.includes('c++') || text.includes('cpp')) return 'cpp';
          return text.split(' ')[0]; // Return first word (e.g., "javascript")
        }
        return 'javascript';
      },
    },
  };

  // Inject script to extract Monaco Editor data safely
  function getMonacoData() {
    return new Promise((resolve) => {
      if (PLATFORM !== 'leetcode') {
        resolve(null);
        return;
      }
      
      const id = 'dsa-sync-monaco-' + Date.now();
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          try {
            let code = null;
            let language = null;
            if (window.monaco && window.monaco.editor) {
              const editors = window.monaco.editor.getEditors();
              if (editors && editors.length > 0) {
                // Find the editor with the most code (avoids empty/stale hidden editors)
                let bestModel = null;
                let maxLength = -1;
                for (const editor of editors) {
                  const model = editor.getModel();
                  if (model) {
                    const val = model.getValue();
                    if (val.length > maxLength) {
                      maxLength = val.length;
                      bestModel = model;
                    }
                  }
                }
                
                if (bestModel) {
                  code = bestModel.getValue();
                  language = bestModel.getLanguageId();
                }
              }
              
              // Fallback to getModels if editors[] is empty for some reason
              if (!code) {
                const models = window.monaco.editor.getModels();
                if (models.length > 0) {
                  let bestModel = models[0];
                  let maxLength = -1;
                  for (const m of models) {
                     const uri = m.uri.toString();
                     if (!uri.includes('node_modules') && !uri.includes('lib.d.ts')) {
                        const val = m.getValue();
                        if (val.length > maxLength) {
                           maxLength = val.length;
                           bestModel = m;
                        }
                     }
                  }
                  code = bestModel.getValue();
                  language = bestModel.getLanguageId();
                }
              }
            }
            window.dispatchEvent(new CustomEvent('${id}', { detail: { code, language } }));
          } catch (e) {
            window.dispatchEvent(new CustomEvent('${id}', { detail: null }));
          }
        })();
      `;
      
      const listener = (e) => {
        window.removeEventListener(id, listener);
        script.remove();
        resolve(e.detail);
      };
      
      window.addEventListener(id, listener);
      document.body.appendChild(script);
      
      setTimeout(() => {
        window.removeEventListener(id, listener);
        if (script.parentNode) script.remove();
        resolve(null);
      }, 1000);
    });
  }

  // Validate if extracted content is actually code and not junk/metadata
  function isValidCode(code) {
    if (!code || typeof code !== 'string') return false;
    if (code.length < 30) return false;
    
    const trimmed = code.trim();
    
    // If it looks like a JSON object or array, it's likely wrong
    // LeetCode code usually starts with: class, function, var, let, const, #include, import, def, etc.
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsed = JSON.parse(trimmed);
        // If it's a plain array or object without a 'code' field, it's definitely junk
        if (Array.isArray(parsed)) return false;
        if (typeof parsed === 'object' && !parsed.code) return false;
      } catch (e) {
        // Not valid JSON, might be actual code
      }
    }
    
    // Check for common patterns that suggest it's NOT code (like those huge number arrays)
    if (trimmed.includes('[') && trimmed.includes(',') && !trimmed.includes('function') && !trimmed.includes('class')) {
       // Heuristic: if it's mostly numbers and brackets
       const digitCount = (trimmed.match(/\d/g) || []).length;
       const alphaCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
       if (digitCount > alphaCount * 2) return false;
    }

    return true;
  }

  // Extract submission data
  async function extractSubmissionData() {
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
      const code = await extractor.getCode();
      const language = await extractor.getLanguage();

      console.log('[DSA Sync] Extraction attempt:', { 
        platform: PLATFORM,
        title: title || 'MISSING',
        titleLength: title ? title.length : 0,
        titlePreview: title ? title.substring(0, 50) : 'N/A',
        code: code ? `${code.length} chars` : 'MISSING',
        codePreview: code ? code.substring(0, 50) : 'N/A',
        language: language,
        url: window.location.href
      });

      // Validate required fields
      if (!title || !isValidCode(code)) {
        console.warn('[DSA Sync] Missing or invalid fields - will retry', { 
          title: !!title, 
          codeValid: isValidCode(code)
        });
        return null;
      }

      const data = {
        title,
        difficulty: extractor.getDifficulty(),
        code,
        language: language,
        platform: PLATFORM,
      };

      console.log('[DSA Sync] Full data:', {
        title: data.title,
        difficulty: data.difficulty,
        language: data.language,
        codeLength: data.code.length
      });

      // Create unique key for deduplication
      const submissionKey = `${title}-${PLATFORM}`;
      const currentTime = Date.now();
      
      // Check if this is a duplicate within the time window
      // Only skip if EXACT same submission within 30 seconds
      if (lastSubmission === submissionKey && (currentTime - lastSubmissionTime) < DUPLICATE_WINDOW) {
        console.log('[DSA Sync] Duplicate submission detected (within 30s window), skipping');
        return null;
      }

      // Update last submission tracking
      lastSubmission = submissionKey;
      lastSubmissionTime = currentTime;
      
      console.log('[DSA Sync] New submission, will process');
      return data;

    } catch (error) {
      console.error('[DSA Sync] Extraction error:', error);
      return null;
    }
  }

  // Handle submission detection
  function handleSubmission() {
    // Prevent concurrent processing
    if (isProcessing) {
      console.log('[DSA Sync] Already processing a submission, skipping');
      return;
    }
    
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(async () => {
      const data = await extractSubmissionData();
      
      if (data) {
        submitClickedTime = 0; // Reset to prevent duplicate syncs from navigation
        isProcessing = true; // Set flag
        console.log('[DSA Sync] Submission detected:', data.title);
        
        // Check if chrome.runtime is available
        if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
          console.error('[DSA Sync] Chrome runtime not available - extension context invalidated');
          showToast('⚠️ Please reload this page to sync', 'error');
          isProcessing = false;
          return;
        }
        
        // Wrap in try-catch to handle context invalidation
        try {
          // Wake up service worker first, then send submission
          chrome.runtime.sendMessage({ type: 'PING' }, (pingResponse) => {
            if (chrome.runtime.lastError) {
              console.warn('[DSA Sync] Service worker wake-up failed:', chrome.runtime.lastError);
              
              // Check if it's context invalidation error
              if (chrome.runtime.lastError.message?.includes('context invalidated')) {
                showToast('⚠️ Please reload this page to sync', 'error');
                isProcessing = false;
                return;
              }
            } else {
              console.log('[DSA Sync] Service worker is alive');
            }
            
            // Send submission (even if ping failed, try anyway)
            setTimeout(() => {
              try {
                chrome.runtime.sendMessage(
                  { type: 'SUBMISSION_DETECTED', data },
                  (response) => {
                    isProcessing = false; // Reset flag
                    
                    if (chrome.runtime.lastError) {
                      console.error('[DSA Sync] Message error:', chrome.runtime.lastError);
                      
                      if (chrome.runtime.lastError.message?.includes('context invalidated')) {
                        showToast('⚠️ Please reload this page to sync', 'error');
                      } else {
                        showToast('⚠️ Extension error - try reloading', 'error');
                      }
                      return;
                    }
                    
                    if (response?.success) {
                      if (response.data?.message === 'Already submitted') {
                         showToast('ℹ️ Already submitted', 'info');
                      } else if (response.data && response.data.githubSynced === false) {
                         showToast(`⚠️ Saved to DB, but GitHub failed: ${response.data.error || ''}`, 'error');
                      } else {
                         // Successfully saved and pushed to GitHub
                         showToast('✅ Synced to GitHub!', 'success');
                      }
                    } else {
                      let errMsg = response?.error;
                      if (typeof errMsg === 'object') {
                        errMsg = errMsg.message || errMsg.error || JSON.stringify(errMsg);
                      }
                      console.error('[DSA Sync] API Submission Rejected:', response?.error);
                      showToast(`⚠️ Sync failed: ${errMsg || 'Unknown error'}`, 'error');
                    }
                  }
                );
              } catch (error) {
                console.error('[DSA Sync] Send message error:', error);
                showToast('⚠️ Please reload this page', 'error');
                isProcessing = false;
              }
            }, 100);
          });
        } catch (error) {
          console.error('[DSA Sync] Runtime error:', error);
          showToast('⚠️ Please reload this page', 'error');
          isProcessing = false;
        }
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

    // Check if chrome extension APIs are available
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.error('[DSA Sync] Chrome extension APIs not available');
      return;
    }

    console.log(`[DSA Sync] Initialized on ${PLATFORM}`);
    console.log('[DSA Sync] Extension ID:', chrome.runtime.id);

    // Observe DOM changes
    observer = new MutationObserver((mutations) => {
      // Check if any mutation contains submission result
      const hasSubmissionResult = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType !== 1) return false;
          
          if (PLATFORM === 'leetcode') {
            // ONLY trigger sync if the user ACTUALLY clicked the submit button recently
            if (Date.now() - submitClickedTime > 60000) {
               return false;
            }

            const text = node.textContent?.toLowerCase() || '';
            
            // Only trigger if a specific submission result container is added
            if (node.getAttribute && node.getAttribute('data-e2e-locator') === 'submission-result') return true;
            if (node.querySelector && node.querySelector('[data-e2e-locator="submission-result"]')) return true;
            
            // Or if we see accepted and the submit button was clicked recently
            if (text.includes('accepted') && (node.classList?.contains('text-green-s') || text.includes('runtime'))) {
               return true;
            }
            return false;
          }

          const text = node.textContent?.toLowerCase() || '';
          
          // GFG patterns
          if (text.includes('problem solved successfully')) return true;
          if (text.includes('all test cases passed')) return true;
          if (text.includes('correct answer')) return true;
          
          // CodingNinjas patterns
          if (text.includes('correct answer') || text.includes('problem solved successfully')) return true;
          if (node.classList && (node.classList.contains('status-correct') || node.classList.contains('success-icon'))) return true;

          return false;
        });
      });

      if (hasSubmissionResult) {
        console.log('[DSA Sync] Submission result detected in DOM');
        handleSubmission();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // Listen for button clicks (Submit button) for all platforms
    document.addEventListener('click', (e) => {
      const target = e.target;
      const btn = target.closest('button');
      
      if (btn) {
        const text = btn.textContent?.toLowerCase() || '';
        const id = btn.id?.toLowerCase() || '';
        const className = btn.className?.toLowerCase() || '';
        const locator = btn.getAttribute('data-e2e-locator') || '';

        // Check if it's a submit button
        if (
          text.includes('submit') || 
          className.includes('submit') || 
          id.includes('submit') ||
          locator === 'console-submit-button'
        ) {
          console.log('[DSA Sync] Submit button clicked, waiting for success state...');
          submitClickedTime = Date.now();
          
          // For GFG, we can manually check after a timeout since their DOM updates might not trigger observer perfectly
          if (PLATFORM === 'gfg') {
            setTimeout(() => {
              handleSubmission();
            }, 3000);
          }
        }
      }
    }, true);
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

  // Test connection on load
  setTimeout(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      console.log('[DSA Sync] Extension connected successfully');
      console.log('[DSA Sync] Extension ID:', chrome.runtime.id);
    } else {
      console.error('[DSA Sync] Extension not properly loaded - please reload extension');
    }
  }, 1000);

})();
