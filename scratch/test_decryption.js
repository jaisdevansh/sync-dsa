
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../apps/backend/.env') });

// Now import the rest
const { createDb, users } = await import('../packages/database/src/index.js');
const { decrypt } = await import('../apps/backend/src/utils/crypto.js');

const db = createDb(process.env.DATABASE_URL);

async function testDecryption() {
  console.log('Using Encryption Key:', process.env.ENCRYPTION_KEY);
  try {
    const allUsers = await db.select().from(users);
    for (const user of allUsers) {
      if (user.githubToken) {
        try {
          const decrypted = decrypt(user.githubToken);
          console.log(`✅ User ${user.githubUsername} (ID: ${user.id}) token: DECRYPTION SUCCESS`);
          // console.log('Decrypted:', decrypted.substring(0, 4) + '...');
        } catch (err) {
          console.log(`❌ User ${user.githubUsername} (ID: ${user.id}) token: DECRYPTION FAILED - ${err.message}`);
        }
      } else {
        console.log(`ℹ️ User ${user.githubUsername} (ID: ${user.id}) has no token.`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

testDecryption();
