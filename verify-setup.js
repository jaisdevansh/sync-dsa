#!/usr/bin/env node

// Verification script for DSA Auto Sync
import { existsSync } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';

const checks = {
  passed: [],
  failed: [],
};

function pass(message) {
  checks.passed.push(message);
  console.log('✅', message);
}

function fail(message) {
  checks.failed.push(message);
  console.log('❌', message);
}

async function checkFile(path, description) {
  if (existsSync(path)) {
    pass(`${description} exists`);
    return true;
  } else {
    fail(`${description} missing: ${path}`);
    return false;
  }
}

async function checkNoTypeScript(dir) {
  try {
    const files = await readdir(dir, { recursive: true });
    const tsFiles = files.filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'));
    
    if (tsFiles.length === 0) {
      pass('No TypeScript files found');
      return true;
    } else {
      fail(`Found ${tsFiles.length} TypeScript files: ${tsFiles.join(', ')}`);
      return false;
    }
  } catch (error) {
    fail(`Error checking TypeScript files: ${error.message}`);
    return false;
  }
}

async function verify() {
  console.log('\n🔍 Verifying DSA Auto Sync Setup...\n');

  // Check backend files
  console.log('📦 Backend Files:');
  await checkFile('apps/backend/src/server.js', 'Server');
  await checkFile('apps/backend/src/worker.js', 'Worker');
  await checkFile('apps/backend/src/config/env.js', 'Config');
  await checkFile('apps/backend/src/routes/auth.js', 'Auth routes');
  await checkFile('apps/backend/src/routes/submission.js', 'Submission routes');
  await checkFile('apps/backend/src/routes/stats.js', 'Stats routes');
  await checkFile('apps/backend/src/controllers/authController.js', 'Auth controller');
  await checkFile('apps/backend/src/controllers/submissionController.js', 'Submission controller');
  await checkFile('apps/backend/src/controllers/statsController.js', 'Stats controller');
  await checkFile('apps/backend/src/services/githubService.js', 'GitHub service');
  await checkFile('apps/backend/src/services/queueService.js', 'Queue service');
  await checkFile('apps/backend/src/services/statsService.js', 'Stats service');
  await checkFile('apps/backend/src/services/workerService.js', 'Worker service');
  await checkFile('apps/backend/src/middleware/authMiddleware.js', 'Auth middleware');
  await checkFile('apps/backend/src/utils/error-handler.js', 'Error handler');
  await checkFile('apps/backend/src/utils/logger.js', 'Logger');
  await checkFile('apps/backend/src/utils/crypto.js', 'Crypto utils');
  await checkFile('apps/backend/src/utils/rate-limit.js', 'Rate limiter');

  console.log('\n📱 Extension Files:');
  await checkFile('apps/extension/manifest.json', 'Manifest');
  await checkFile('apps/extension/content.js', 'Content script');
  await checkFile('apps/extension/background.js', 'Background script');
  await checkFile('apps/extension/popup.html', 'Popup HTML');
  await checkFile('apps/extension/popup.js', 'Popup script');
  await checkFile('apps/extension/styles.css', 'Styles');
  await checkFile('apps/extension/utils/api.js', 'API utils');

  console.log('\n🎨 Dashboard Files:');
  await checkFile('apps/dashboard/app/page.js', 'Home page');
  await checkFile('apps/dashboard/app/layout.js', 'Layout');
  await checkFile('apps/dashboard/app/dashboard/page.js', 'Dashboard page');
  await checkFile('apps/dashboard/components/StatsCard.js', 'Stats card');
  await checkFile('apps/dashboard/components/PlatformStats.js', 'Platform stats');
  await checkFile('apps/dashboard/components/RecentList.js', 'Recent list');
  await checkFile('apps/dashboard/lib/api.js', 'API lib');

  console.log('\n🗄️ Database Files:');
  await checkFile('packages/database/src/schema.ts', 'Database schema');
  await checkFile('packages/database/src/index.ts', 'Database index');

  console.log('\n📝 Documentation:');
  await checkFile('README.md', 'README');
  await checkFile('SETUP.md', 'Setup guide');
  await checkFile('START.md', 'Quick start');
  await checkFile('LAUNCH_CHECKLIST.md', 'Launch checklist');
  await checkFile('READY_TO_LAUNCH.md', 'Ready to launch');

  console.log('\n🔍 Checking for TypeScript files:');
  await checkNoTypeScript('apps/backend/src');

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Passed: ${checks.passed.length}`);
  console.log(`❌ Failed: ${checks.failed.length}`);
  console.log('='.repeat(50));

  if (checks.failed.length === 0) {
    console.log('\n🎉 All checks passed! Ready to launch!\n');
    console.log('Next steps:');
    console.log('1. Configure .env file');
    console.log('2. Generate extension icons');
    console.log('3. Run: npm run dev:backend');
    console.log('4. Run: npm run dev:worker');
    console.log('5. Run: npm run dev:dashboard');
    console.log('6. Load extension in Chrome\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some checks failed. Please fix the issues above.\n');
    process.exit(1);
  }
}

verify().catch(console.error);
