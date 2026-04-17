import { logger } from '../utils/logger.js';

class GitHubService {
  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.repoCache = new Set(); // Cache verified repositories
  }

  async fetch(url, options) {
    logger.info(`[GitHub] API Request: ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`[GitHub] API Error (${response.status}): ${errorText}`);
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async ensureRepo(token, username, repoName) {
    const cacheKey = `${username}/${repoName}`;
    if (this.repoCache.has(cacheKey)) {
      logger.info(`[GitHub] Repo already verified in cache: ${cacheKey}`);
      return;
    }

    logger.info(`[GitHub] Verifying repository exists: ${cacheKey}`);
    try {
      await this.fetch(`${this.baseUrl}/repos/${username}/${repoName}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      logger.info(`[GitHub] ✅ Repo verified successfully: ${cacheKey}`);
      this.repoCache.add(cacheKey);
    } catch (error) {
      logger.info(`[GitHub] Repo not found or error. Attempting to create: ${cacheKey}`);
      try {
        await this.fetch(`${this.baseUrl}/user/repos`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: repoName,
            description: 'DSA solutions auto-synced',
            private: false,
            auto_init: true,
          }),
        });
        this.repoCache.add(cacheKey);
        logger.info(`[GitHub] ✅ Repo created successfully: ${cacheKey}`);
      } catch (createError) {
        logger.error(`[GitHub] ❌ Failed to create repo: ${createError.message}`);
        // If it failed because it already exists (race condition), cache it anyway
        if (createError.message.includes('already exists') || createError.message.includes('name already exists')) {
          logger.info(`[GitHub] Repo actually already exists, caching it: ${cacheKey}`);
          this.repoCache.add(cacheKey);
        } else {
          throw createError;
        }
      }
    }
  }

  getFilePath(submission) {
    const ext = this.getExtension(submission.language);
    const sanitized = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${submission.platform}/${submission.difficulty}/${sanitized}.${ext}`;
  }

  getExtension(language) {
    const map = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rust: 'rs',
    };
    return map[language.toLowerCase()] || 'txt';
  }

  async pushToGitHub(options) {
    const { token, repoName, username, submission } = options;
    const cacheKey = `${username}/${repoName}`;

    logger.info(`[GitHub] 🚀 Starting push process for: "${submission.title}"`);
    
    // Only verify repo if not in cache
    if (!this.repoCache.has(cacheKey)) {
      await this.ensureRepo(token, username, repoName);
    }

    const filePath = this.getFilePath(submission);
    logger.info(`[GitHub] Target file path: ${filePath}`);
    let sha;

    try {
      logger.info(`[GitHub] Checking if file already exists...`);
      const existing = await this.fetch(
        `${this.baseUrl}/repos/${username}/${repoName}/contents/${filePath}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      sha = existing.sha;
      logger.info(`[GitHub] ✏️ File exists! Will update existing file. (SHA: ${sha})`);
    } catch {
      logger.info(`[GitHub] 📄 File does not exist yet. Will create new file.`);
      // File doesn't exist, which is fine for creation
    }

    const content = Buffer.from(submission.code).toString('base64');
    logger.info(`[GitHub] Sending PUT request to save file...`);

    const response = await this.fetch(
      `${this.baseUrl}/repos/${username}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${submission.title}`,
          content,
          ...(sha && { sha }),
        }),
      }
    );

    logger.info(`[GitHub] 🎉 Push successful: "${submission.title}" (Commit URL: ${response?.commit?.html_url || 'Unknown'})`);
    return filePath;
  }
}

export const githubService = new GitHubService();
