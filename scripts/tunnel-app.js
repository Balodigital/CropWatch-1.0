const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

console.log('📡 [CropWatch] Starting Secure Tunnel via Cloudflare...');

let tunnelUrl = null;
let expoProcess = null;

// 1. Start Cloudflare Tunnel
const tunnelProcess = spawn(npxCmd, ['cloudflared', 'tunnel', '--url', 'http://localhost:8081'], {
    shell: true
});

tunnelProcess.stderr.on('data', (data) => {
    const output = data.toString();
    // Cloudflare outputs the URL in stderr
    const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    
    if (match && !tunnelUrl) {
        tunnelUrl = match[0];
        console.log(`\n✅ [Tunnel] Live at: ${tunnelUrl}`);
        startExpo();
    }
    
    // Log important errors but don't flood
    if (output.includes('ERR')) {
        console.error(`❌ [Tunnel Error] ${output.trim()}`);
    }
});

function startExpo() {
    if (expoProcess) return;

    console.log('🚀 [Expo] Starting development server with Proxy URL...');
    
    // Set environment variable for Expo to use the tunnel for manifest and QR code
    process.env.EXPO_PACKAGER_PROXY_URL = tunnelUrl;
    
    expoProcess = spawn(npxCmd, ['expo', 'start'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, EXPO_PACKAGER_PROXY_URL: tunnelUrl }
    });

    expoProcess.on('close', (code) => {
        console.log(`\n👋 [Expo] Process exited with code ${code}`);
        tunnelProcess.kill();
        process.exit(code || 0);
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 [CropWatch] Shutting down tunnels...');
    if (expoProcess) expoProcess.kill();
    tunnelProcess.kill();
    process.exit();
});

// Fallback if URL is not found within 30 seconds
setTimeout(() => {
    if (!tunnelUrl) {
        console.error('❌ [Timeout] Failed to obtain Cloudflare Tunnel URL. Please check your internet connection.');
        tunnelProcess.kill();
        process.exit(1);
    }
}, 30000);



