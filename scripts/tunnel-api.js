const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

console.log('\n📡 [CropWatch API] Initializing Backend Tunnel...');

let tunnelUrl = null;
let apiProcess = null;

// 1. Start API Server
apiProcess = spawn('node', [`"${path.join(__dirname, '..', 'api', 'server.js')}"`], {
    stdio: 'inherit',
    shell: true
});

// 2. Start Cloudflare Tunnel for API (Port 3000)
const tunnelProcess = spawn(npxCmd, ['cloudflared', 'tunnel', '--url', 'http://localhost:3000'], {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
});

tunnelProcess.stderr.on('data', (data) => {
    const output = data.toString();
    const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    
    if (match && !tunnelUrl) {
        tunnelUrl = match[0];
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ [API TUNNEL LIVE]`);
        console.log(`🔗 URL: ${tunnelUrl}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Notify parent process if applicable
        if (process.send) {
            process.send({ type: 'API_URL', url: tunnelUrl });
        }
    }
    
    if (output.includes('ERR')) {
        if (!output.includes('failed to connect to local server')) {
            console.error(`❌ [API Tunnel Error] ${output.trim()}`);
        }
    }
});

function stopAll() {
    console.log('\n🛑 [CropWatch API] Shutting down...');
    if (apiProcess) apiProcess.kill();
    tunnelProcess.kill();
    process.exit();
}

process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
