const { fork, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const APP_ENV_PATH = path.join(__dirname, '..', 'app', '.env');
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🌱 [CropWatch] Starting Full Stack Tunnel System');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 1. Start API Tunnel
const apiTunnel = fork(path.join(__dirname, 'tunnel-api.js'), { stdio: 'inherit' });

apiTunnel.on('message', (message) => {
    if (message.type === 'API_URL') {
        const url = message.url;
        updateAppEnv(url);
        startAppTunnel();
    }
});

function updateAppEnv(url) {
    if (!fs.existsSync(APP_ENV_PATH)) {
        console.error(`❌ Error: ${APP_ENV_PATH} not found.`);
        return;
    }

    console.log(`📝 Syncing API URL to App environment...`);
    let content = fs.readFileSync(APP_ENV_PATH, 'utf8');
    const regex = /^EXPO_PUBLIC_API_URL=.*$/m;
    const newLine = `EXPO_PUBLIC_API_URL=${url}`;

    if (regex.test(content)) {
        content = content.replace(regex, newLine);
    } else {
        content += `\n${newLine}\n`;
    }

    fs.writeFileSync(APP_ENV_PATH, content);
    console.log(`✅ App .env updated.\n`);
}

function startAppTunnel() {
    console.log('📱 Starting Mobile App Tunnel...');
    
    const appTunnel = fork(path.join(__dirname, 'tunnel-app.js'), {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..', 'app')
    });


    appTunnel.on('close', (code) => {
        console.log(`\n👋 App process exited with code ${code}`);
        apiTunnel.kill();
        process.exit(code);
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down everything...');
    apiTunnel.kill();
    process.exit();
});
