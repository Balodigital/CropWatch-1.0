const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const APP_ENV_PATH = path.join(__dirname, '..', 'app', '.env');
const API_PORT = 3000;

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

console.log('🌱 Starting CropWatch Tunnel Sync via Cloudflare...');

// Function to update .env file
function updateAppEnv(url) {
  if (!fs.existsSync(APP_ENV_PATH)) {
    console.error(`❌ Error: ${APP_ENV_PATH} not found.`);
    return;
  }

  let content = fs.readFileSync(APP_ENV_PATH, 'utf8');
  const regex = /^EXPO_PUBLIC_API_URL=.*$/m;
  const newLine = `EXPO_PUBLIC_API_URL=${url}`;

  if (regex.test(content)) {
    content = content.replace(regex, newLine);
  } else {
    content += `\n${newLine}\n`;
  }

  fs.writeFileSync(APP_ENV_PATH, content);
  console.log(`✅ Updated app/.env with API URL: ${url}`);
}

// Start Cloudflare Tunnel for the API
console.log(`📡 Opening tunnel for API on port ${API_PORT}...`);
const tunnelProcess = spawn(npxCmd, ['cloudflared', 'tunnel', '--url', `http://localhost:${API_PORT}`], {
  shell: true
});

let apiUrlFound = false;

tunnelProcess.stderr.on('data', (data) => {
  const output = data.toString();
  // Match Cloudflare tunnel URL
  const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
  
  if (match && !apiUrlFound) {
    const url = match[0];
    apiUrlFound = true;
    console.log(`🌐 API Tunnel Live: ${url}`);
    updateAppEnv(url);
    console.log('\n🚀 Step 2: Now run this in another terminal:');
    console.log('   npm run tunnel:app');
    console.log('\n(Keep this terminal open to maintain the backend link)');
  }

  if (output.includes('ERR')) {
    console.error(`❌ Tunnel Error: ${output.trim()}`);
  }
});

tunnelProcess.on('close', (code) => {
  console.log(`📡 Tunnel closed with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  tunnelProcess.kill();
  process.exit();
});

