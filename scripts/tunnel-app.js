const { spawn } = require('child_process');
const http = require('http');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

console.log('📡 Starting Expo and preparing secure tunnel...');

// 1. First, start Expo
const expoProcess = spawn(npxCmd, ['expo', 'start'], {
    stdio: 'inherit',
    shell: true
});

let tunnelProcess = null;

// Function to check if Metro is ready (responding to requests)
function checkMetroReady(callback) {
    const options = {
        hostname: '127.0.0.1',
        port: 8081,
        path: '/',
        method: 'GET',
        timeout: 2000
    };

    const req = http.request(options, (res) => {
        callback(true);
    });

    req.on('error', () => {
        callback(false);
    });

    req.on('timeout', () => {
        req.destroy();
        callback(false);
    });

    req.end();
}

function startTunnel() {
    console.log('\n🌐 Metro is ready. Establishing localtunnel...');
    
    if (tunnelProcess) tunnelProcess.kill();

    tunnelProcess = spawn(npxCmd, ['lt', '--port', '8081'], { shell: true });

    tunnelProcess.stdout.on('data', (data) => {
        const output = data.toString();
        const match = output.match(/url is: (https:\/\/[^\s]+)/);
        if (match) {
            const tunnelUrl = match[1];
            process.env.EXPO_PACKAGER_PROXY_URL = tunnelUrl;
            
            console.log(`\n✅ Tunnel active at: ${tunnelUrl}`);
            console.log(`⚠️  CRITICAL: Have your teammates open this URL in their mobile browser FIRST:`);
            console.log(`👉 ${tunnelUrl}`);
            console.log(`They MUST click "Click to Continue" on that page, then they can scan the QR code.\n`);
            console.log(`(If you don't see the QR code, press 'r' in the terminal to refresh Expo)\n`);
        }
    });

    tunnelProcess.on('close', (code) => {
        if (code !== 0) {
            console.log('⚠️  Tunnel disconnected. Retrying in 5 seconds...');
            setTimeout(startTunnel, 5000);
        }
    });
}

// Wait for Metro to be ready before starting the tunnel
// Check every 10 seconds to avoid overloading Metro while it's bundling
const checkInterval = setInterval(() => {
    checkMetroReady((ready) => {
        if (ready) {
            clearInterval(checkInterval);
            startTunnel();
        }
    });
}, 10000);


expoProcess.on('close', (code) => {
    console.log(`Expo exited with code ${code}`);
    if (tunnelProcess) tunnelProcess.kill();
    process.exit(code || 0);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    if (tunnelProcess) tunnelProcess.kill();
    expoProcess.kill();
    process.exit();
});


