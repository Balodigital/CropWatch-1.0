const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const APP_ENV_PATH = path.join(__dirname, '..', 'app', '.env');
const API_PORT = 3000;

console.log('🌱 Starting CropWatch Tunnel Sync...');

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

// Start ngrok for the API
console.log(`📡 Opening tunnel for API on port ${API_PORT}...`);
const lt = spawn('npx', ['ngrok', 'http', API_PORT.toString()], {
  shell: true
});

lt.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // ngrok outputs URL in JSON format like: {"url":"https://xxx.ngrok-free.app"}
  const jsonMatch = output.match(/"url"\s*:\s*"([^"]+)"/);
  const urlMatch = jsonMatch ? jsonMatch[1] : output.match(/https?:\/\/[^\s]+/);
  
  if (urlMatch) {
    const url = urlMatch[1] || urlMatch[0];
    console.log(`🌐 API Tunnel Live: ${url}`);
    updateAppEnv(url);
    console.log('\n🚀 Step 2: Now run this in another terminal:');
    console.log('   cd app && npx expo start --tunnel');
    console.log('\n(Keep this terminal open to maintain the backend link)');
  }
});

lt.stderr.on('data', (data) => {
  console.error(`❌ Tunnel Error: ${data}`);
});

lt.on('close', (code) => {
  console.log(`📡 Tunnel closed with code ${code}`);
});
