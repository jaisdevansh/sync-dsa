class GitHubService {
  constructor() {
    this.baseUrl = 'https://api.github.com';
  }

  async fetch(url, options) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async ensureRepo(token, username, repoName) {
    try {
      await this.fetch(`${this.baseUrl}/repos/${username}/${repoName}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
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

    await this.ensureRepo(token, username, repoName);

    const filePath = this.getFilePath(submission);
    let sha;

    try {
      const existing = await this.fetch(
        `${this.baseUrl}/repos/${username}/${repoName}/contents/${filePath}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      sha = existing.sha;
    } catch {
      // File doesn't exist
    }

    const content = Buffer.from(submission.code).toString('base64');

    await this.fetch(
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

    return filePath;
  }
}

export const githubService = new GitHubService();
