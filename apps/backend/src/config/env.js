import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // Auth
  jwtSecret: process.env.JWT_SECRET,
  encryptionKey: process.env.ENCRYPTION_KEY,
  
  // GitHub OAuth
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

// Validate required env vars
const required = {
  DATABASE_URL: 'Database Connection String',
  JWT_SECRET: 'Secret for Auth Tokens',
  ENCRYPTION_KEY: '32-char key for GitHub Token encryption',
  GITHUB_CLIENT_ID: 'GitHub App Client ID',
  GITHUB_CLIENT_SECRET: 'GitHub App Secret',
};

const missing = [];
for (const [key, desc] of Object.entries(required)) {
  if (!process.env[key]) {
    missing.push(`${key} (${desc})`);
  }
}

if (missing.length > 0) {
  console.error('\n❌ CRITICAL: Missing Environment Variables:');
  missing.forEach(m => console.error(`   - ${m}`));
  console.error('\nPlease set these in your Render Dashboard or .env file.\n');
  
  if (config.nodeEnv === 'production') {
    process.exit(1); 
  }
}
