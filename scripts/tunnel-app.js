const { spawn } = require('child_process');

console.log('📡 Requesting secure localtunnel for your app to bypass Ngrok blockages...');

// Start localtunnel instead of ngrok because Ngrok CRL checks are timing out
const tunnel = spawn('npx', ['lt', '--port', '8081'], { shell: true });

let expoStarted = false;

tunnel.stdout.on('data', (data) => {
  const output = data.toString();
  
  // Extract URL from localtunnel's log format (e.g., your url is: https://xxxx.loca.lt)
  const match = output.match(/url is: (https:\/\/[^\s]+)/);

  if (match && !expoStarted) {
    expoStarted = true;
    const tunnelUrl = match[1];
    
    console.log(`\n✅ Tunnel active at: ${tunnelUrl}`);
    console.log(`⚠️  NOTE: When your teammates scan the QR code and open this URL, they might see a "Friendly Reminder" screen. They just need to click "Click to Continue" to enter the app!\n`);
    console.log('🚀 Starting Expo with custom QR tunnel...\n');

    // Start Expo using the LocalTunnel explicitly
    const expoProcess = spawn('npx', ['expo', 'start'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        EXPO_PACKAGER_PROXY_URL: tunnelUrl,
      }
    });

    expoProcess.on('close', (code) => {
      console.log(`Expo exited with code ${code}`);
      tunnel.kill(); 
      process.exit(code);
    });
  }
});

tunnel.stderr.on('data', (data) => {
  // Suppress warnings unless critical
});

tunnel.on('close', (code) => {
  if (code !== 0) console.log(`Tunnel process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    tunnel.kill();
    process.exit();
});
