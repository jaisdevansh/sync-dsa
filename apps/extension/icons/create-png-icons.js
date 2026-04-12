// Node.js script to create PNG icons from SVG
// Run: node create-png-icons.js

const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Dark gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#0F172A');
  gradient.addColorStop(1, '#1E293B');
  
  // Draw rounded rectangle background
  const radius = size * 0.22;
  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, size, size, radius);
  ctx.fill();

  // Scale factor
  const scale = size / 128;

  // Draw code brackets </>
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2 * scale;
  ctx.lineJoin = 'round';

  // Left bracket <
  ctx.beginPath();
  ctx.moveTo(28 * scale, 64 * scale);
  ctx.lineTo(42 * scale, 44 * scale);
  ctx.lineTo(48 * scale, 48 * scale);
  ctx.lineTo(38 * scale, 64 * scale);
  ctx.lineTo(48 * scale, 80 * scale);
  ctx.lineTo(42 * scale, 84 * scale);
  ctx.closePath();
  ctx.fill();

  // Slash /
  ctx.save();
  ctx.translate(64 * scale, 64 * scale);
  ctx.rotate(15 * Math.PI / 180);
  ctx.fillRect(-4 * scale, -24 * scale, 8 * scale, 48 * scale);
  ctx.restore();

  // Right bracket >
  ctx.beginPath();
  ctx.moveTo(100 * scale, 64 * scale);
  ctx.lineTo(86 * scale, 44 * scale);
  ctx.lineTo(80 * scale, 48 * scale);
  ctx.lineTo(90 * scale, 64 * scale);
  ctx.lineTo(80 * scale, 80 * scale);
  ctx.lineTo(86 * scale, 84 * scale);
  ctx.closePath();
  ctx.fill();

  // Blue code lines (only for larger icons)
  if (size >= 48) {
    ctx.fillStyle = '#3B82F6';
    
    // Top right
    roundRect(ctx, 72 * scale, 20 * scale, 12 * scale, 4 * scale, 2 * scale);
    ctx.fill();
    roundRect(ctx, 88 * scale, 20 * scale, 24 * scale, 4 * scale, 2 * scale);
    ctx.fill();
    
    // Bottom left
    roundRect(ctx, 16 * scale, 96 * scale, 8 * scale, 4 * scale, 2 * scale);
    ctx.fill();
    roundRect(ctx, 28 * scale, 96 * scale, 20 * scale, 4 * scale, 2 * scale);
    ctx.fill();
  }

  // Sync arrows with lightning (only for larger icons)
  if (size >= 48) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 6 * scale;
    ctx.lineCap = 'round';
    
    // Circular arrow
    ctx.beginPath();
    ctx.arc(64 * scale, 64 * scale, 26 * scale, 0, 2 * Math.PI * 0.95);
    ctx.stroke();
    
    // Arrow heads
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(90 * scale, 64 * scale);
    ctx.lineTo(96 * scale, 58 * scale);
    ctx.lineTo(96 * scale, 70 * scale);
    ctx.closePath();
    ctx.fill();
    
    // Lightning bolt
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.moveTo(68 * scale, 52 * scale);
    ctx.lineTo(60 * scale, 64 * scale);
    ctx.lineTo(66 * scale, 64 * scale);
    ctx.lineTo(60 * scale, 76 * scale);
    ctx.lineTo(68 * scale, 64 * scale);
    ctx.lineTo(62 * scale, 64 * scale);
    ctx.closePath();
    ctx.fill();
  }

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`icon${size}.png`, buffer);
  console.log(`✅ Created icon${size}.png`);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Create all icon sizes
async function main() {
  try {
    await createIcon(16);
    await createIcon(48);
    await createIcon(128);
    console.log('\n🎉 All icons created successfully!');
    console.log('📁 Files saved in current directory');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Install canvas package: npm install canvas');
  }
}

main();
