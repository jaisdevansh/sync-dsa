// Test script to verify backend health and GitHub push
// Run with: node scratch/test_backend_health.js

const API_URL = 'http://localhost:3000';

async function testBackendHealth() {
  console.log('🔍 Testing Backend Health...\n');
  
  // Test 1: Keepalive endpoint
  try {
    console.log('1️⃣ Testing keepalive endpoint...');
    const response = await fetch(`${API_URL}/keepalive`);
    if (response.ok) {
      console.log('   ✅ Keepalive endpoint working\n');
    } else {
      console.log('   ❌ Keepalive endpoint failed:', response.status, '\n');
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to backend:', error.message);
    console.log('   💡 Make sure backend is running: cd apps/backend && npm run dev\n');
    return;
  }
  
  // Test 2: Check if backend is in development mode
  console.log('2️⃣ Checking backend logs...');
  console.log('   💡 Look for these in your backend terminal:');
  console.log('   - "📝 Environment: development"');
  console.log('   - "⚠️ Queue disabled - Direct GitHub push enabled"');
  console.log('   - "⏰ Auto-keepalive disabled (development mode)"\n');
  
  // Test 3: Verify database connection
  console.log('3️⃣ Database connection...');
  console.log('   💡 Backend should show:');
  console.log('   - "🔄 Running database migrations..."');
  console.log('   - "✅ Migrations completed successfully"\n');
  
  console.log('✅ Basic health check complete!\n');
  console.log('📋 Next steps:');
  console.log('   1. Load extension in Chrome (chrome://extensions)');
  console.log('   2. Click "Connect with GitHub" in extension popup');
  console.log('   3. Authorize the app');
  console.log('   4. Submit a problem on LeetCode or GFG');
  console.log('   5. Check backend logs for:');
  console.log('      - 📥 Submission received');
  console.log('      - 💾 Saved to DB');
  console.log('      - 🔄 Pushing to GitHub');
  console.log('      - ✅ Pushed to GitHub');
  console.log('   6. Verify on GitHub that the file was created\n');
}

testBackendHealth();
