const http = require('http');

function getNgrokUrl() {
  http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const tunnel = json.tunnels.find(t => t.proto === 'https');
        if (tunnel) {
          console.log(`NGROK_URL:${tunnel.public_url}`);
        } else {
          console.log('No HTTPS tunnel found');
        }
      } catch (e) {
        console.error('Failed to parse Ngrok JSON');
      }
    });
  }).on('error', (err) => {
    console.error('Ngrok API not reachable yet...');
  });
}

getNgrokUrl();
